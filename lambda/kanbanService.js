const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient({region: 'ap-northeast-1'});
const { tableName } = require('config/config.js');
let event_ = null;
let context_ = null;

exports.handler = (event, context, callback) => {
  const operation = event.method;
  event_ = event;
  context_ = context;

  switch (operation) {
    case method.GET : 
      handleGetMethod();
      break;
    case method.POST : 
      handlePostMethod();
      break;

    default:
      break;
  }
}


function handleGetMethod() {
  console.log('Start to operate GET method');
  switch (event_.action){
    case action.GET_ALL_TASKS :
      getAllTasks();
      break;

    default:
      break;
  }
}

async function getAllTasks() {
  try {
    let params = {
      TableName : tableName.KANBAN_TASKS,
      Key : {
        id : 1
      }
    }
    let rowTasks = await dynamo.scan(params).promise();
    console.log('Got data by "getTodaysTodo"');
    console.log('Got "rowTasks"');
    console.log(rowTasks);

    const sortedTasks = await createTasksObject(rowTasks);
    console.log('Got "sortedTasks"');
    console.log(sortedTasks);
    context_.succeed(sortedTasks);
  } catch (error) {
    console.error(`[Error]: ${JSON.stringify(error)}`);
    context_.fail(error);
  }
}

/**
 * Sort and create an object to show tasks on client side
 * @param {Object} data
 * @returns {Object}
 */
async function createTasksObject(data){
  let allTasks = [];
  const groups = await getKanbanGroup();
  console.log('groups data');
  console.log(groups);

  // Add group name and fix group order
  groups.Items.sort((a, b) => {
    return a.group_order < b.group_order ? -1 : 1;
  })
  groups.Items.forEach(group => {
    allTasks.push({
      compName : group.name,
      compId : group.kanban_id,
      contents : []
    });
  });
  console.log('Sorted groups');
  console.log(allTasks);

  // Divide contents with group
  data.Items.forEach((task) => {
    allTasks.forEach((group) => {
      if(group.compId === task.group_id){
        if(group.contents.length === 0){
          console.log('group.contents.length === 0')
          console.log(JSON.stringify(group.contents))
          group.contents.push({
            date : task.date,
            tasks : [{
              id : task.task_id,
              name : task.content,
              order : task.order
            }]
          });
        }else{
          let hasDate = false;
          group.contents.forEach((content) => {
            if(content.date === task.date){
              content.tasks.push({
                id : task.task_id,
                name : task.content,
                order : task.order
              });
              hasDate = true
            }
          });
          if(!hasDate){
            group.contents.push({
              date : task.date,
              tasks : [{
                id : task.task_id,
                name : task.content,
                order : task.order
              }]
            });
          }
        }
      };
    })
  })
  console.log('Added data to allTasks');
  console.log(JSON.stringify(allTasks));

  // Sort each contents
  allTasks.forEach((group) => {
    group.contents.forEach(content => {
      content.tasks.sort((a, b) => {
        return a.order < b.order ? -1 : 1;
      });
    });
    group.contents.sort((a, b) => {
      let dateA = new Date(a.date);
      let dateB = new Date(b.date);
      return dateA.getTime() < dateB.getTime() ? -1 : 1;
    });
  })
  console.log('All sorting logics are finished');
  console.log(allTasks);
  return allTasks;
}

/**
 * Get data of Kanban Group
 */
async function getKanbanGroup() {
  try {
    let params = {
      TableName : tableName.KANBAN_GROUP,
      Key : 'group_id',
    }
    return await dynamo.scan(params).promise();
  } catch (error) {
    console.error(`[Error]: ${JSON.stringify(error)}`);
    return error;
  }
}

const action = {
  GET_ALL_TASKS : 'getAllTasks'
}

const method = {
  GET : 'GET',
  POST : 'POST'
}