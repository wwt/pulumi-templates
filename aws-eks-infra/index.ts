import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";
import * as eks from "@pulumi/eks";

// Get configuration for the stack
const config = new pulumi.Config();

const baseTags = {
    Owner: config.require("ownerTag")
};

// Create a VPC for the cluster.
const vpc = new awsx.ec2.Vpc("kafka-vpc", {
    numberOfAvailabilityZones: config.requireNumber("numOfAvailZones"),
    tags: {
        ...baseTags,
        Name: "kafka-vpc"
    }
});

// Create an EKS cluster with the given configuration.
const cluster = new eks.Cluster("kafka-cluster", {
    vpcId: vpc.id,
    subnetIds: vpc.privateSubnetIds,
    instanceType: config.require("instanceType") as aws.ec2.InstanceType,
    desiredCapacity: config.requireNumber("desiredCapacity"),
    minSize: config.requireNumber("minSize"),
    maxSize: config.requireNumber("maxSize"),
    tags: baseTags
});

// Export kubeconfig
export const kubeconfig = cluster.kubeconfig;

// Export the vpc zones for use in the confluent operator aws provider config
export const vpcZones = vpc.privateSubnetIds.then(subnetIds =>
    subnetIds.map(id => id.apply(
        id => aws.ec2.getSubnet({id}).then(result =>
            result.availabilityZone)
    ))
);
