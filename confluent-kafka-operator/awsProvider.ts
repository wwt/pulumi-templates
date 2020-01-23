import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const config = new pulumi.Config();

export function createConfig(zones: String[]) {
    return {
        "operator": {
            "enabled": config.requireBoolean("enableOperator"),
            "licenseKey": config.requireSecret("confluentLicenseKey")
        },
        "global": {
            "provider": {
                "name": "aws",
                "region": aws.config.region,
                "kubernetes": {
                    "deployment": {
                        "zones": zones
                    }
                },
                "storage": {
                    "provisioner": "kubernetes.io/aws-ebs",
                    "reclaimPolicy": "Delete",
                    "parameters": {
                        "encrypted": "false",
                        "kmsKeyId": "",
                        "type": "gp2"
                    }
                },
                "registry": {
                    "fqdn": "docker.io",
                    "credential": {
                        "required": false
                    }
                }
            },
            "sasl": {
                "plain": {
                    "username": "test",
                    "password": "test123"
                }
            }
        },
        "zookeeper": {
            "name": "zookeeper",
            "replicas": 3,
            "enabled": config.requireBoolean("enableZookeeper"),
            "resources": {
                "requests": {
                    "cpu": "200m",
                    "memory": "512Mi"
                }
            }
        },
        "kafka": {
            "name": "kafka",
            "replicas": 3,
            "enabled": config.requireBoolean("enableKafka"),
            "resources": {
                "requests": {
                    "cpu": "200m",
                    "memory": "1Gi"
                }
            },
            "volume": {
                "data0": config.require("kafkaData0Size")
            },
            "loadBalancer": {
                "enabled": false,
                "domain": ""
            },
            "tls": {
                "enabled": false,
                "fullchain": "",
                "privkey": "",
                "cacerts": ""
            },
            "metricReporter": {
                "enabled": true
            }
        },
        "connect": {
            "name": "connectors",
            "replicas": 2,
            "enabled": config.requireBoolean("enableConnect"),
            "tls": {
                "enabled": false,
                "authentication": {
                    "type": ""
                },
                "fullchain": "",
                "privkey": "",
                "cacerts": ""
            },
            "loadBalancer": {
                "enabled": false,
                "domain": ""
            },
            "dependencies": {
                "kafka": {
                    "bootstrapEndpoint": "kafka:9071",
                    "brokerCount": 3
                },
                "schemaRegistry": {
                    "enabled": true,
                    "url": "http://schemaregistry:8081"
                }
            }
        },
        "replicator": {
            "name": "replicator",
            "replicas": 2,
            "enabled": config.requireBoolean("enableReplicator"),
            "tls": {
                "enabled": false,
                "authentication": {
                    "type": ""
                },
                "fullchain": "",
                "privkey": "",
                "cacerts": ""
            },
            "loadBalancer": {
                "enabled": false,
                "domain": ""
            },
            "dependencies": {
                "kafka": {
                    "brokerCount": 3,
                    "bootstrapEndpoint": "kafka:9071"
                }
            }
        },
        "schemaregistry": {
            "name": "schemaregistry",
            "enabled": config.requireBoolean("enableSchemaRegistry"),
            "tls": {
                "enabled": false,
                "authentication": {
                    "type": ""
                },
                "fullchain": "",
                "privkey": "",
                "cacerts": ""
            },
            "loadBalancer": {
                "enabled": false,
                "domain": ""
            },
            "dependencies": {
                "kafka": {
                    "brokerCount": 3,
                    "bootstrapEndpoint": "kafka:9071"
                }
            }
        },
        "ksql": {
            "name": "ksql",
            "replicas": 2,
            "enabled": config.requireBoolean("enableKsql"),
            "tls": {
                "enabled": false,
                "authentication": {
                    "type": ""
                },
                "fullchain": "",
                "privkey": "",
                "cacerts": ""
            },
            "loadBalancer": {
                "enabled": false,
                "domain": ""
            },
            "dependencies": {
                "kafka": {
                    "brokerCount": 3,
                    "bootstrapEndpoint": "kafka:9071",
                    "brokerEndpoints": "kafka-0.kafka:9071,kafka-1.kafka:9071,kafka-2.kafka:9071"
                },
                "schemaRegistry": {
                    "enabled": true,
                    "tls": {
                        "enabled": false,
                        "authentication": {
                            "type": ""
                        }
                    },
                    "url": "http://schemaregistry:8081"
                }
            }
        },
        "controlcenter": {
            "name": "controlcenter",
            "enabled": config.requireBoolean("enableControlCenter"),
            "license": config.requireSecret("confluentLicenseKey"),
            "dependencies": {
                "c3KafkaCluster": {
                    "brokerCount": 3,
                    "bootstrapEndpoint": "kafka:9071",
                    "zookeeper": {
                        "endpoint": "zookeeper:2181"
                    }
                },
                "connectCluster": {
                    "enabled": true,
                    "url": "http://connectors:8083"
                },
                "ksql": {
                    "enabled": true,
                    "url": "http://ksql:9088"
                },
                "schemaRegistry": {
                    "enabled": true,
                    "url": "http://schemaregistry:8081"
                }
            },
            "loadBalancer": {
                "enabled": false,
                "domain": ""
            },
            "tls": {
                "enabled": false,
                "authentication": {
                    "type": ""
                },
                "fullchain": "",
                "privkey": "",
                "cacerts": ""
            },
            "auth": {
                "basic": {
                    "enabled": false,
                    "property": {
                        "admin": "Developer1,Administrators",
                        "disallowed": "no_access"
                    }
                }
            }
        }
    };
}
