# D3DynamicTreeLayout-QS
Qlik Sense extension that displays an Hierarchical Tree using D3, with user interaction.

Tested with Qlik Sense June 2017.

Features included are:
  * Horizontal and Vertical Orentation
  * Customizable look and coloring
  * Nodes can be represented by circles or rectangular boxes
  * Tooltips on Mouse Over for additional info - tooltips can be plain text of HTML based for custom look & feel
  * Boxes can display 1 line of additional info
  * Nodes are selectable - selected node will also select related child nodes
  * Nodes can have indepent colors
  * Control the links colors independently

An example and tutorial app can be found in the 'App Example and Tutorial' folder.

### Release History
 * v1 - Initial relase of the extension
 * v1.1 - Added independent coloring for nodes and links
 * v1.1.1 - Minor update - added some verifications before loading the tree. If something wrong is detected it
   displays a warning in the extension's placeholder and avoids loading the tree.
 * v1.2 - Added 2 new orientations for the tree - right to left and bottom up
 * v1.2.1 - Added a new verifications before loading the tree.
 * v1.2.2 - Fixed an issue that would restrain the rendering in Qlik Sense v3.2
 * v1.2.3 - Fixed an issue that prevented the creation of the extension from scratch on v3.2
 * v1.2.4 - Fixed an issue that would prevent the rendering of the extension in Qlik Sense v3.2.3
 * v1.3 - Added Calculation Condition


![alt text](./Screenshots%20Example/Screenshot-1.PNG?raw=true) 
![alt text](./Screenshots%20Example/Screenshot-3.png?raw=true) 
![alt text](./Screenshots%20Example/Screenshot-4.png?raw=true) 
![alt text](./Screenshots%20Example/Screenshot-5.png?raw=true) 
![alt text](./Screenshots%20Example/Screenshot-7.PNG?raw=true)
