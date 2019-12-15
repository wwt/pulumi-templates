# Pulumi Templates

These folders hold templates that are used to create Pulumi projects. If project specific instructions are necessary, they will be located in the README for that project.

### Creating a Project

1. Make a new folder and change directory into that folder:

   ```sh
   mkdir <project-folder> && cd <project-folder>
   ```

2. Instantiate a new project:

   ```sh
   pulumi new https://github.com/wwt/pulumi-templates/folder-name
   ```

3. Follow the prompts to configure your deployment.
4. Run `pulumi up` to preview and deploy the stack.



### Destroying the Project

1. Run `pulumi destroy` to tear down the stack

2. Remove the stack and its history with:

   ```
   pulumi stack rm dev
   ```


