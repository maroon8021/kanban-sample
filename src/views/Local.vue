<template>
  <div class="local">
    <div class="list" v-for="lists in updateAlltasks" :key="lists.compName">
      <div class="title">
        {{lists.compName}}
      </div>
      <draggable :group="lists.compName" v-for="list in lists.contents" :key="lists.compName+'_'+list.date" :class="lists.compName+'_'+list.date" @change="showLog" @update="update">
        <div v-for="task in list.tasks" :key="task.id">{{task.name}}</div>
      </draggable>
    </div>

    <ul>
        <li v-for="list in updateWebsocketLists" :key="list.id">{{list.title}}</li>
      </ul>
      <button @click="onClick">button</button>
  </div>
</template>

<script>
// @ is an alias to /src
import draggable from "vuedraggable";
import io from 'socket.io-client'

export default {
  name: "local",
  components: {
    draggable
  },
  data() {
    return {
      websocketLists :[{id: 1, title:'test'}],
      socket : null,
      allTasks: []
    };
  },
  computed: {
    updateWebsocketLists : function(){
      return this.websocketLists
    },
    updateAlltasks : {
      get(){
        return this.allTasks;
      },
      set(value){
        console.log(JSON.stringify(value));
        //this.allTasks = value;
      }
    },
  },
  mounted(){
    this.socket = io('http://localhost:7000',{
      transports: ['websocket'],
      rejectUnauthorized: false
    });
    // https://github.com/socketio/socket.io-client/issues/1097#issuecomment-338827233
    this.socket.on('message', message => {
      if(message){
        this.websocketLists.push(message);
      }
    });
    this.socket.on('initialized', initialTasks => {
      console.log('initialized');
      console.log(initialTasks);
      this.allTasks = initialTasks;
    });
    this.socket.emit('initialize');
  },
  methods:{
    onClick(e){
      let date = new Date();
      let newListItem = {
        id : this.websocketLists.length,
        title : date.toString()
      }

      this.socket.emit('message', newListItem);
    },
    showLog(e){
      console.log(e);
    },
    update(e){
      console.log(e);
    }
  }
};
</script>
<style lang="scss">
.local{
  display: flex;
  flex-direction: column;
}
.list{
  display: flex;
  flex-direction: row;
  max-width: 25%;
  div{
    position: relative;
    display: block;
    padding: .75rem 1.25rem;
    margin-bottom: -1px;
    border: 1px solid rgba(0,0,0,.125);
    min-width: 20%;
    &.title{
      text-align: center;
      background-color: #000;
      color: #fff;
      display: flex;
      justify-content:center;
      align-items: center;
    }
  }
}
</style>