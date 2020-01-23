import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import * as awsConfluent from "./awsProvider"

const namespace = {
    kafka: "kafka"
};
const config = new pulumi.Config();

//Get infra stack outputs
const infraStack = new pulumi.StackReference(config.require("username") + "/" + config.require("infraProjectName") + "/" + pulumi.getStack());
const kubeconfig = infraStack.getOutput("kubeconfig").apply(JSON.stringify);

//Create generic provider
const k8sGenericProvider = new k8s.Provider("k8s-generic", {
    kubeconfig: kubeconfig
});

//Create namespace
const kafkaNamespace = new k8s.core.v1.Namespace(namespace.kafka, {
    metadata: {name: namespace.kafka}
}, {provider: k8sGenericProvider});

//Create namespace providers
const k8sKafkaProvider = new k8s.Provider("k8s-kafka", {
    kubeconfig: kubeconfig, namespace: namespace.kafka
});

//Deploy Kafka
const confluentOperatorChart = new k8s.helm.v2.Chart("confluent-operator", {
    path: "confluent-operator/helm/confluent-operator",
    namespace: namespace.kafka,
    values: infraStack.getOutput("vpcZones").apply(vpcZones => awsConfluent.createConfig(vpcZones))
}, {dependsOn: [kafkaNamespace], providers: {kubernetes: k8sKafkaProvider}});

export const kafkaServiceHostname = "kafka." + namespace.kafka + ".svc.cluster.local:9092";
export const schemaRegistryServiceHostname = "http://schemaregistry." + namespace.kafka + ".svc.cluster.local:8081";
