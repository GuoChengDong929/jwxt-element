<template>
    <div>
        <p style="margin:300px 0px 0px 500px;font-size: 100px;color: red;font-weight: normal">页面开发中..</p>
    </div>
</template>

<script>

    import { findHttpTraces } from '@/api/actuator/traces'

    export default {
        name: "traces-index",
        data(){
            return {
                traces:[]
            }
        },
        created() {
            /*findHttpTraces().then(res=>{
                console.log(res.data);
            })*/
        }
    }
</script>

<style scoped>

</style>