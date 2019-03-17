<template>
  <div class="local">
    <div class="list" v-for="(lists, index) in myArray" :key="lists.compName">
      <div class="title" v-if="index != 10"><!--Will be fixed -->
        {{lists.compName}}
      </div>
      <draggable :group="lists.compName" v-for="list in lists.contents" :key="lists.compName+'_'+list.date" :class="lists.compName+'_'+list.date">
        <div v-for="task in list.tasks" :key="task.id">{{task.name}}</div>
      </draggable>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import draggable from "vuedraggable";

export default {
  name: "local",
  components: {
    draggable
  },
  data() {
    return {
      myArray: [
        {
          compName: "group1",
          contents: [
            {
              date: '2019/03/11',
              tasks: [
                {
                  id: 1,
                  name: '1'
                },
                {
                  id: 2,
                  name: '2'
                },
                {
                  id: 3,
                  name: '3'
                },
              ]
            },
            {
              date: '2019/03/18',
              tasks: [
                {
                  id: 4,
                  name: '4'
                },
                {
                  id: 5,
                  name: '5'
                },
                {
                  id: 6,
                  name: '6'
                },
              ]
            },
          ]
        },
        {
          compName: "group2",
          contents: [
            {
              date: '2019/03/11',
              tasks: [
                {
                  id: 7,
                  name: '7'
                },
                {
                  id: 8,
                  name: '8'
                },
                {
                  id: 9,
                  name: '9'
                },
              ]
            },
            {
              date: '2019/03/18',
              tasks: [
                {
                  id: 10,
                  name: '10'
                },
                {
                  id: 11,
                  name: '11'
                },
                {
                  id: 12,
                  name: '13'
                },
              ]
            },
          ]
        },
      ]
    };
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