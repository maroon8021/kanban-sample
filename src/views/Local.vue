<template>
  <div class="local">
    <draggable group="tasks" v-for="lists in myArray" :key="lists.id" class="list">
      <div v-for="list in lists.content" :key="list.id">{{list.name}}</div>
    </draggable>
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
          id: "group1",
          content: [
            {
              id: 1,
              name: "1"
            },
            {
              id: 2,
              name: "2"
            },
            {
              id: 3,
              name: "3"
            }
          ]
        },
        {
          id: "group2",
          content: [
            {
              id: 4,
              name: "4"
            },
            {
              id: 5,
              name: "5"
            },
            {
              id: 6,
              name: "6"
            }
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
    background-color: #fff;
    border: 1px solid rgba(0,0,0,.125);
  }
}
</style>