# Mailing Service
> Mailing Service for CCET IA 2

## AWS lamdba which is responsible to compile and map all inventory items to their respective inventories and create a list of items with quantities
 
### HOW DOES IT WORK?
- We pull data from mongodb and map them into different inventories. 
- At the end of the day, an EventBridge trigger runs which invokes the AWS lambda, thus compiling and mailing the inventory updates to the inventory owners.

### TECHNOLOGIES USED
- AWS lambda
- AWS EventBridge
- Nodejs
- MongoDB

### Team
- 1911089 - Vedant Mahadik
- 1911093 - Neelansh Mathur
- 1911109 - Burhanuddin Rangwala
