# frc-kotlin-blocks
 
Chrome and Firefox plugin for injecting kotlin codeblocks into [https://docs.wpilib.org]

# Adding Blocks

To add kotlin blocks to a file start by creating a `.yml` file in `/blocks/`, where the name matches the name of the html file of the page you're adding to (https://docs.wpilib.org/en/stable/docs/software/hardware-apis/motors/using-motor-controllers.html -> using-motor-controllers.yml)

In this yaml file create a key for each code block, they're indexed starting at zero from top to bottom, with the keys being block0, block1, etc. Then use a `|` character to show that the value is multiline, then just add the code block underneath, making sure to indent with two spaces.

Example
```yaml
block0: |
  This will be added to the first block in the page
  This goes in the same block

block1: |
  This goes in the second block
  You get the idea
```
