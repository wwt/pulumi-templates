import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";
import * as eks from "@pulumi/eks";

// Get configuration for the stack
const config = new pulumi.Config();
const instanceType = config.require("instanceType") as aws.ec2.InstanceType;
const desiredCapacity: number = config.requireNumber("desiredCapacity");
const minSize: number = config.requireNumber("minSize");
const maxSize: number = config.requireNumber("maxSize");
const deployDashboard: boolean = config.requireBoolean("deployDashboard");
const numberOfAvailZones: number = config.requireNumber("numOfAvailZones");

const baseTags = {
    Owner: config.require("ownerTag")
};

// Create a VPC for our cluster.
const vpc = new awsx.ec2.Vpc("kafka-vpc", {
    numberOfAvailabilityZones: numberOfAvailZones,
    tags: Object.assign(baseTags, {Name: "kafka-vpc"})
});

// Create an EKS cluster with the given configuration.
const cluster = new eks.Cluster("kafka-cluster", {
    vpcId: vpc.id,
    subnetIds: vpc.privateSubnetIds,
    instanceType: instanceType,
    desiredCapacity: desiredCapacity,
    minSize: minSize,
    maxSize: maxSize,
    deployDashboard: deployDashboard,
    tags: baseTags
});

// Create a bucket to sink all of our messages to
const kafkaBucket = new aws.s3.Bucket("stream-demo-kafka-bucket", {
    forceDestroy: true,
    tags: baseTags
});

export const bucketName = kafkaBucket.bucket
// export const storageClassName = helper.getStorageClass(cluster);
export const kubeconfig = cluster.kubeconfig; // create a stack export for kubeconfig
// Export the vpc zones for use in the confluent operator aws provider config
export const vpcZones = vpc.privateSubnetIds.then(subnetIds =>
    subnetIds.map(id => id.apply(
        id => aws.ec2.getSubnet({id}).then(result =>
            result.availabilityZone)
    ))
);
