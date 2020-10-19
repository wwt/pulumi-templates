import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";
import * as eks from "@pulumi/eks";

// Get the configuration for the current stack
const config = new pulumi.Config();

// Create the baseTags object
const baseTags = {
    Owner: config.require("ownerTag")
};

// Create a VPC for the cluster with configured number of availability zones
// and named with the provided name.
const vpc = new awsx.ec2.Vpc(config.require("vpcName"), {
    numberOfAvailabilityZones: config.requireNumber("numOfAvailZones"),
    tags: {
        ...baseTags,
        Name: config.require("vpcName")
    }
});

// Create an EKS cluster with the provided configuration options.
const cluster = new eks.Cluster(config.require("eksClusterName"), {
    vpcId: vpc.id,
    subnetIds: vpc.privateSubnetIds,
    instanceType: config.require("instanceType") as aws.ec2.InstanceType,
    desiredCapacity: config.requireNumber("desiredCapacity"),
    minSize: config.requireNumber("minSize"),
    maxSize: config.requireNumber("maxSize"),
    tags: baseTags
});

// Export the kubeconfig
export const kubeconfig = cluster.kubeconfig;

// Export the vpc zones for use in the confluent operator project
export const vpcZones = vpc.privateSubnetIds.then(subnetIds =>
    subnetIds.map(id => id.apply(
        id => aws.ec2.getSubnet({id}).then(result =>
            result.availabilityZone
        )
    ))
);
