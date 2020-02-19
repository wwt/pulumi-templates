# Kafka Deployment - AWS

A Pulumi program template that deploys the Confluent Operator and its components to the EKS cluster created from the [infrastructure project](https://github.com/wwt/pulumi-templates/tree/master/aws-eks-infra).

#### Deployed Resources:

* Confluent Operator
* 3 Brokers
* 3 Zookeepers
* Schema Registry
* KSQL
* Connect Cluster
* Replicator
* Control Center



#### Requirements

1. `kubectl`, `helm`, `aws-cli`, `pulumi-cli`, `aws iam-authenticator`, and `node.js` v8 or later installed.
   - [kubectl install](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
   - [helm install](https://helm.sh/docs/using_helm/#installing-helm)
   - [aws-cli install](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
   - [pulumi-cli install](https://www.pulumi.com/docs/get-started/install/)
   - [iam-authenticator install](https://docs.aws.amazon.com/eks/latest/userguide/install-aws-iam-authenticator.html)
   - [node.js install](https://nodejs.org/en/download/)
2. Create an account at https://app.pulumi.com/ by signing in with your source control account. This gives you access to their SaaS state management offering. It’s free for individual users.
3. IAM Access to an AWS account and the Access Key Id and Secret Access Key.
4. IAM permissions to be able to CreateRole, create VPC, and EKS.
5. The `aws-cli` configured to connect to your AWS account using the above IAM Access.



### Deploying Kafka

1. Create a new folder:

   ```sh
   mkdir confluent-kafka-operator && cd confluent-kafka-operator
   ```

2. Create a new project:

   ```sh
   pulumi new https://github.com/wwt/pulumi-templates/confluent-kafka-operator
   ```

3. Fill out the prompts appropriately. **Note: A Confluent License key is required. Trial key is ok.**

4. Run `pulumi up` to preview and deploy the changes. This will only configure the Kubernetes cluster and deploy the operator.

5. Enable and deploy Zookeeper with:

   ```sh
   pulumi config set enableZookeeper true && pulumi update --skip-preview
   ```

6. Wait for all 3 zookeeper pods to be ready then enable and deploy the brokers:

   ```sh
   pulumi config set enableKafka true && pulumi update --skip-preview
   ```

7. Wait for all 3 broker pods to be ready then enable any remaining components you would like to deploy the same way you deployed Zookeeper and the brokers. e.g.

   ```sh
   pulumi config set enableSchemaRegistry true && pulumi update --skip-preview
   ```



### Destroying the Infrastructure

1. Disable all components except for the operator by setting all the config vars for the respective components to `false` (e.g. `pulumi config set enableSchemaRegistry false`) then run `pulumi update --skip-preview`

   * If the brokers stuck in a terminating state, go into your AWS console and detach the remaining EBS volumes. This will allow the brokers to fully terminate. Make sure the `kafka` pods are no longer present before proceeding with the next step.

2. Run `pulumi destroy --skip-preview` to finish tearing down the stack.

3. Remove the stack and its history with:

   ```
   pulumi stack rm dev
   ```



