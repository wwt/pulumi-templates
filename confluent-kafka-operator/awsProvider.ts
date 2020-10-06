import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();
const awsConfig = new pulumi.Config("aws");

export function createConfig(zones: String[]) {
    return {
        "serviceAccounts": {
            "operator": {
                "name": "cc-operator"
            }
        },
        "operator": {
            "enabled": config.requireBoolean("enableOperator")
        },
        "global": {
            "provider": {
                "name": "aws",
                "region": awsConfig.require("region"),
                "kubernetes": {
                    "deployment": {
                        "zones": zones
                    }
                },
                "registry": {
                    "fqdn": "docker.io",
                    "credential": {
                        "required": false
                    }
                }
            },
            "telemetry": {
                "enabled": false,
                "secretRef": "",
                "proxy": false
            },
            "storageClassName": "",
            "sasl": {
                "plain": {
                    "username": "test",
                    "password": "test123"
                }
            },
            "authorization": {
                "rbac": {
                    "enabled": false
                },
                "simple": {
                    "enabled": false
                },
                "superusers": []
            },
            "dependencies": {
                "mds": {
                    "endpoint": "",
                    "publicKey": ""
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
            "enabled": config.requireBoolean("enableKafka"),
            "replicas": 3,
            "volume": {
                "data0": config.require("kafkaData0Size")
            },
            "loadBalancer": {
                "enabled": false,
                "domain": ""
            },
            "metricReporter": {
                "enabled": true
            },
            "configOverrides": {
                "server": [
                    "confluent.balancer.enable=true"
                ]
            }
        },
        "connect": {
            "name": "connectors",
            "replicas": 2,
            "enabled": config.requireBoolean("enableConnect"),
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
