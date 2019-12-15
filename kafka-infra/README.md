# Kafka Infrastructure - AWS

A Pulumi program template that deploys the necessary infrastructure for Kafka on Kubernetes.

#### Deployed Resources:

* VPC with 3 availability zones
* EKS Cluster with 10 r5.xlarge nodes (configurable)



### Deploying the Infrastructure

1. Create a new folder:

   ```sh
   mkdir kafka-infra && cd kafka-infra
   ```

2. Create a new project:

   ```sh
   pulumi new https://github.com/wwt/kafka-infra
   ```

3. Fill out the prompts appropriately.

4. Run `pulumi up` to preview and deploy the changes.

5. See [https://github.com/wwt/kafka-services](https://github.com/wwt/kafka-services) to deploy Confluent Kafka to this infrastructure

   

   

### Destroying the Infrastructure

1. Run `pulumi destroy` to tear down the stack

2. Remove the stack and its history with:

   ```
   pulumi stack rm dev
   ```

   