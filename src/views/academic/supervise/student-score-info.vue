<template>
    <div>
        <el-dialog :visible.sync="value" fullscreen :title="nickName+'详细的考试记录'">
            {{examId}}
            {{scoreId}}
            {{studentId}}
            {{classesId}}
        </el-dialog>
    </div>
</template>

<script>

    import { getStudentScores } from "@/api/academic/supervise";

    export default {
        name: "student-score-info",
        data(){
            return {
                value: false,
                studentId: null,
                classesId: null,
                nickName: ""
            }
        },
        watch:{
            value(data){
                if(data){
                    getStudentScores({studentId:this.studentId,classesId:this.classesId}).then(res=>{

                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>