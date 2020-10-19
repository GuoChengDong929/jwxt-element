<template>
    <div>

        <div style="margin: 20px 5px 10px 5px;padding: 5px;">
            <el-button  size="mini" type="success" @click="startExam" plain> <span class="el-icon-document-checked"></span> 开始考试</el-button>
            <el-button  size="mini" type="success" @click="showResult" plain> <span class="el-icon-view"></span> 查看试卷</el-button>
            <el-button  size="mini" type="success" @click="analysisExam" plain> <span style="margin-right:5px" class="el-icon-document-copy"></span>成绩分析</el-button>
        </div>


        <div style="margin: 5px;padding: 5px;">
            <el-table :data="data" :loading="loading" border highlight-current-row @current-change="handleCurrentChange">
                <el-table-column prop="examName" label="试卷名称" align="center"></el-table-column>
                <el-table-column prop="examTime" label="考试时间" align="center">
                    <template slot-scope="scope">
                        {{format(scope.row.examTime)}}
                    </template>
                </el-table-column>
                <el-table-column prop="examTimeLength" label="考试时长" align="center"></el-table-column>
                <el-table-column prop="examType" label="试卷类型" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.examType == '1' ? 'success': (scope.row.examType == '2' ? 'warning':'danger')">
                            {{scope.row.examType == '1' ? '日测':(scope.row.examType == '2' ? '周测' : '月考')}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="examStatus" label="试卷状态" align="center">
                    <template slot-scope="scope">
                        <el-tag  v-if="scope.row.examStatus != '2'" :type="scope.row.examStatus == '1' ? 'info' : (scope.row.examStatus == '2' ? 'danger': (scope.row.examStatus == '3' ? 'warning' : 'success'))">
                            {{scope.row.examStatus == '1' ? '未开始' :(scope.row.examStatus == '2' ? '进行中': (scope.row.examStatus == '3' ? '批阅中': '已结束'))}}
                        </el-tag>
                        <img  height="50px" width="100px"  v-if="scope.row.examStatus == '2'" src="../../../assets/running.png" alt="">
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div style="margin: 5px;padding: 5px;text-align:center">
            <el-pagination background
                           layout="prev,pager,next"
                           :total="params.total"
                           :page-size="params.size"
                           :current-page="params.page"
                           :hide-on-single-page="true"
                           @size-change="handleSizeChange"
                           @current-change="handlePageChange"></el-pagination>
        </div>

        <exam-student-show ref="examStudentShow"></exam-student-show>
        <exam-student-result ref="examStudentResult"></exam-student-result>
        <exam-student-analysis ref="examStudentAnalysis"></exam-student-analysis>
    </div>
</template>

<script>

    import { getList,getScoreStatus,getShowExamStatus } from "@/api/student/exam";
    import { formatDate } from '@/utils/tools.js'

    export default {
        name: "exam-student-index",
        components:{
            ExamStudentShow:()=>import("@/views/student/exam/exam-student-show.vue"),
            ExamStudentResult:()=>import("@/views/student/exam/exam-student-result.vue"),
            ExamStudentAnalysis:()=> import("@/views/student/exam/exam-student-analysis.vue")
        },
        data(){
            return {
                data:[],
                loading:true,
                params:{page:1,size:10,total:0,questionType:'1'},
                currentRow: null
            }
        },
        methods:{
            format(date){
                return formatDate(date);
            },
            handleCurrentChange(val){
                this.currentRow = val;
            },
            handleSizeChange(val){
                this.params.size = val;
                this.getList(this.params);
            },
            handlePageChange(val){
                this.params.page = val;
                this.getList(this.params);
            },
            getList(data){
                getList(data).then(res=>{
                    if(res.data.success){
                        this.data = res.data.data.rows;
                        this.params.total = res.data.data.total;
                        this.loading = false;
                    }
                });
            },
            startExam(){
                if(!this.currentRow){
                    this.$message.error("请选中一行");
                    return false;
                }
                if(this.currentRow.examStatus != '2'){
                    this.$message.error("目前阶段无法开始考试");
                    return false;
                }

                getScoreStatus({id:this.currentRow.id}).then(res=>{
                    if(res.data.success){
                        this.$refs['examStudentShow'].examData = {};
                        this.$refs['examStudentShow'].parentData = this.currentRow;
                        this.$refs['examStudentShow'].value = true;
                    }else{
                        this.$message.error(res.data.message);
                        return false;
                    }
                })
            },
            showResult(){
                if(!this.currentRow){
                    this.$message.error("请选中一行");
                    return false;
                }
                if(this.currentRow.examStatus != '4'){
                    this.$message.error("目前阶段无法查看试卷");
                    return false;
                }

                //阻止非法操作: 后台接口查询:当前登录人的score是否为2,试卷状态是否为4  如果不是则不允许查看
                getShowExamStatus({id:this.currentRow.id}).then(res=>{
                    if(!res.data.success){
                        this.$message.error("非法操作");
                        this.getList(this.params);
                        return false;
                    }else{
                        this.$refs['examStudentResult'].examData = {};
                        this.$refs['examStudentResult'].parentData = this.currentRow;
                        this.$refs['examStudentResult'].value = true;
                    }
                });
            },
            analysisExam(){
                if(!this.currentRow){
                    this.$message.error("请选中一行");
                    return false;
                }
                if(this.currentRow.examStatus != '4'){
                    this.$message.error("目前阶段无法查看试卷");
                    return false;
                }

                //阻止非法操作: 后台接口查询:当前登录人的score是否为2,试卷状态是否为4  如果不是则不允许查看
                getShowExamStatus({id:this.currentRow.id}).then(res=>{
                    if(!res.data.success){
                        this.$message.error("非法操作");
                        this.getList(this.params);
                        return false;
                    }else{

                        this.$refs['examStudentAnalysis'].parentData = this.currentRow;
                        this.$refs['examStudentAnalysis'].value = true;
                    }
                });
            }
        },
        created() {
            this.getList(this.params);
        }
    }
</script>

<style scoped>

</style>