import { k8sCluster, k8sProvider } from "./cluster";
import * as azure from "@pulumi/azure";
import {resourceGroup} from "./config";

const storageAccount = new azure.storage.Account("streamDemo", {
    resourceGroupName: resourceGroup.name,
    accountReplicationType: "LRS",
    accountTier: "Standard",
    accountKind: "StorageV2",
});

export let storageAccountName = storageAccount.name;
export let storageAccountBlobConnString = storageAccount.primaryBlobConnectionString;
export let cluster = k8sCluster.name;
export let kubeConfig = k8sCluster.kubeConfigRaw;
// export let serviceIP = apache
//     .getResourceProperty("v1/Service", "apache-apache", "status")
//     .apply(status => status.loadBalancer.ingress[0].ip);
