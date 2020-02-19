# EKS Infrastructure - AWS

A Pulumi program template that deploys a VPC and an EKS cluster in AWS.

#### Deployed Resources:

* VPC with 3 availability zones
* EKS Cluster with 10 r5.xlarge nodes (configurable)

#### Requirements

1. `kubectl`,`aws-cli`, `pulumi-cli`, `aws iam-authenticator`, and `node.js` v8 or later installed.
   - [kubectl install](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
   - [aws-cli install](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
   - [pulumi-cli install](https://www.pulumi.com/docs/get-started/install/)
   - [iam-authenticator install](https://docs.aws.amazon.com/eks/latest/userguide/install-aws-iam-authenticator.html)
   - [node.js install](https://nodejs.org/en/download/)
2. Create an account at https://app.pulumi.com/ by signing in with your source control account. This gives you access to their SaaS state management offering. It’s free for individual users.
3. IAM Access to an AWS account and the Access Key Id and Secret Access Key.
4. IAM permissions to be able to CreateRole, create VPC, and EKS.
5. The `aws-cli` configured to connect to your AWS account using the above IAM Access.


### Deploying the Infrastructure

1. Create a new folder:

   ```sh
   mkdir aws-eks-infra && cd aws-eks-infra
   ```

2. Create a new project:

   ```sh
   pulumi new https://github.com/wwt/pulumi-templates/aws-eks-infra
   ```

3. Fill out the prompts appropriately.

4. Run `pulumi up` to preview and deploy the changes.

5. See [kafka-services](https://github.com/wwt/pulumi-templates/tree/master/kafka-services) to deploy Confluent Kafka to this infrastructure

   

   

### Destroying the Infrastructure

1. Run `pulumi destroy` to tear down the stack

2. Remove the stack and its history with:

   ```
   pulumi stack rm dev
   ```

   