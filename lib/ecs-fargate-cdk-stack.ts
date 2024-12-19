import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as logs from 'aws-cdk-lib/aws-logs';

export class EcsFargateCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a VPC (with 2 availability zones)
    const vpc = new ec2.Vpc(this, 'MyVpc', { maxAzs: 2 });

    // Create an ECS Cluster
    const cluster = new ecs.Cluster(this, 'MyEcsCluster', { vpc });

    // Define a Fargate Task Definition
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'MyTaskDef', {
      memoryLimitMiB: 512,
      cpu: 256,
    });

    // Add a container to the task definition
    taskDefinition.addContainer('MyContainer', {
      image: ecs.ContainerImage.fromRegistry('cvjaipal/aws:latest'), // Your Docker image
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'MyApp',
        logGroup: new logs.LogGroup(this, 'MyLogGroup', {
          removalPolicy: cdk.RemovalPolicy.DESTROY, // Only for dev/test environments
        }),
      }),
      portMappings: [{ containerPort: 80 }],
    });

    // Create an ECS Fargate Service
    new ecs.FargateService(this, 'MyEcsService1', {
      cluster,
      taskDefinition,
      desiredCount: 1, // Number of tasks to run
      assignPublicIp: true, // Allow public IP for Fargate tasks
    });
  }
}
