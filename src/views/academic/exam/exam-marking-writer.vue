<template>
   <div>
        <el-dialog :visible.sync="value" fullscreen center	>

            <el-card v-for="(item,i) in object[index]" :key="item.id" style="margin: 10px">

                <el-form label-width="80" label-position="right">
                    <el-form-item label="问题">{{item.askContent}}</el-form-item>
                    <el-form-item label="回答">{{item.askAnswer}}</el-form-item>
                    <el-form-item label="评分">
                        <el-input  v-model="item.score" placeholder="请输入评分" style="width: 400px"></el-input>
                    </el-form-item>
                    <el-form-item label="评语">
                        <el-input  v-model="item.teacherComment"  placeholder="请输入评语" style="width: 400px"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button v-if="item.markingStatus == '1'"  @click="updateStudentAskScore(item)" type="success" plain>为【<font style="color:red">{{item.nickName}}</font>】的第【<font style="color:red">{{i + 1}}</font>】题评分</el-button>
                    </el-form-item>
                </el-form>
            </el-card>

            <template slot="footer">
                <el-button type="danger" :disabled="index == 0" @click="back">上一页</el-button>
                <el-button type="danger" :disabled="index == (object.length - 1)" @click="next">下一页</el-button>

                <el-button type="info" @click="endExam" plain>结束考试</el-button>
            </template>

        </el-dialog>
        
   </div>
</template>
<script>

    import { markingStudentAsks,updateStudentAskScore,getStudentAskResult,endExam } from "@/api/academic/exam";

    export default {
        name : 'exam-marking-writer',
        components:{
            ExamStudentAsk:()=>import("@/views/academic/exam/exam-student-ask.vue")
        },
        data(){
            return {
                askScore:0,
                value : false,
                parentData:{},
                data:null,
                index:0,
                object:[]
            }
        },
        watch:{
            value(data){
                if(data){
                    this.index = 0;
                    this.markingStudentAsks(this.parentData);
                }
            },
            data(data){
                if(data){
                    let asks = this.data.asks;  //问答题题目集合
                    let list = this.data.list;  //所有学生答题信息集合 list[0] 第一个学生

                    let array  = [];

                    list.forEach(item=>{

                        let nickName = item.user.nickName;

                        let scoreId = item.score.id;

                        let o = {nickName:nickName,scoreId:scoreId};

                        let answerList = item.list;

                        let arr = [];

                        answerList.forEach((obj,index)=>{
                            obj = Object.assign(obj,asks[index]);
                            let newObject = Object.assign(obj,o);
                            arr.push(newObject);
                        });

                        array.push(arr);

                    });
                    this.object = array;
                }
            }
        },
        methods:{
            back(){
                this.index --;
            },
            next(){
                this.index ++;
            },
            markingStudentAsks(data){ //获得该试卷所有学生的所有问答题
                markingStudentAsks(data).then(res=>{
                    if(res.data.success){
                        this.data = res.data.data;
                    }
                });
            },
            updateStudentAskScore(data){ //给某个学生的某个问答题评分
                this.$confirm("确定要评分吗?","友情提示",{type:'warning'}).then(()=>{
                    getStudentAskResult(data).then(res=>{
                        if(res.data.success){
                            updateStudentAskScore(data).then(res=>{
                                this.$message({
                                    type:res.data.success ? 'success' :'error',
                                    message:res.data.message
                                });
                            });
                        }else{
                            this.$message.error("该问答题已评分");
                            return false;
                        }
                    });
                });
            },
            endExam(){
                this.$confirm("确定要结束考试吗?","友情提示",{type:'warning'}).then(()=>{
                    endExam(this.parentData).then(res=>{
                        if(res.data.success){
                            this.$message({
                                type: res.data.success ? 'success' : 'error',
                                message:res.data.message
                            });
                            this.value = false;
                            this.$parent.getExamList(this.$parent.params);
                        }
                    });
                });
            }
        }
    }
</script>
<style scoped>

</style>