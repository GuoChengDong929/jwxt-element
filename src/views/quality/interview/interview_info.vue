<template>
    <div>
       <el-drawer :visible.sync="dialogVisible" :show-close="true">
           <Scroll height="800">
                <el-timeline style="margin: 20px">
                    <el-timeline-item :timestamp="'最后访谈时间:' + formatDate(item.createTime)" placement="top" :key="item.id" v-for="item in data">
                        <el-card style="border: 0px" shadow="never">
                            <h4 style="margin-bottom: 5px">被访谈人：{{info.studentName}}</h4>
                            <h4 style="margin-bottom: 5px">访谈地点：{{item.interviewAddress}}</h4>
                            <h4 style="margin-bottom: 5px">访谈目的：{{item.interviewObjective}}</h4>
                            <h4 style="margin-bottom: 5px">访谈内容：{{item.interviewContent}}</h4>
                            <h4 style="margin-bottom: 5px">访谈结果：{{item.interviewResults}}</h4>
                        </el-card>
                    </el-timeline-item>
                </el-timeline>
           </Scroll>
       </el-drawer>
    </div>
</template>

<script>

    import { formatDate } from "../../../utils/tools";
    import { getInterviewInfo } from "../../../api/quality/interview/interview";

    export default {
        name: "interview_info",
        data(){
            return{
                data:[],
                info:{},
                dialogVisible:false
            }
        },
        watch:{
          dialogVisible(data){
              if(data){
                  getInterviewInfo(this.info).then(res=>{
                      console.log(res);
                        if(res.data.success){
                            this.data = res.data.data;
                        }else{
                            this.$message.error(res.data.message);
                        }
                  })
              }
          }
        },
        methods:{
            formatDate(date){
                return formatDate(date);
            }
        }
    }
</script>

<style scoped>

</style>