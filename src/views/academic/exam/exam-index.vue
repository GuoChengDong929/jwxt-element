<template>
    <div>
        <div style="margin: 20px 5px 10px 5px;padding: 5px;">
			<el-button plain type="success" @click="openWindow('examChild')"> <span style="margin-right:5px" class="el-icon-plus"></span>新增试卷</el-button>
            <el-button plain type="success" @click="startExam"  v-loading.fullscreen.lock="fullscreenLoading"> <span style="margin-right:5px" class="el-icon-check"></span>开始考试</el-button>
            <el-button plain type="success" @click="showExam"> <span style="margin-right:5px" class="el-icon-view"></span>查看试卷</el-button>
            <el-button plain type="success" @click="monitorExam"> <span style="margin-right:5px" class="el-icon-message-solid"></span>监控答题</el-button>
            <el-button plain type="success" @click="markingWriter"> <span style="margin-right:5px" class="el-icon-edit-outline"></span>批阅问答</el-button>
            <el-button plain type="success" @click="analysisScore"> <span style="margin-right:5px" class="el-icon-document-copy"></span>成绩分析</el-button>
            <el-button plain type="success" @click="explainExam"> <span style="margin-right:5px" class="el-icon-document-copy"></span>试卷讲解</el-button>
            <el-button plain type="danger" @click="drawerValue = true" style="float: right"> <span style="margin-right:5px" class="el-icon-search"></span>查询</el-button>
		</div>
        <div style="margin: 5px;padding: 5px;">
            <el-table :data="exams" :loading="loading" highlight-current-row @current-change="handleCurrentChange">
                <el-table-column type="index" align="center"></el-table-column>
                <el-table-column prop="classesName" label="班级名称" align="center"></el-table-column>
                <el-table-column label="试卷参数" align="center">
                    <el-table-column label="时间相关" align="center">
                        <el-table-column prop="examTime" label="考试时间" align="center">
                            <template slot-scope="scope">
                                {{format(scope.row.examTime)}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="examTimeLength" label="考试时长" align="center">
                            <template slot-scope="scope">
                                {{scope.row.examTimeLength}}分钟
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column prop="examName" label="试卷名称" align="center"></el-table-column>
                </el-table-column>

                <el-table-column label="状态类型" align="center">
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
                    <el-table-column prop="examPattern" label="出题模式" align="center">
                        <template slot-scope="scope">
                            <font :style="{'color':  scope.row.examPattern == '1' ? 'black' : 'red'}">
                                <strong>
                                    {{scope.row.examPattern == '1' ? '手动' : '自动'}}
                                </strong> 
                            </font>      
                        </template>
                    </el-table-column>
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



        <el-drawer style="height: 400px" :show-close="false" :visible.sync="drawerValue" direction="ttb" :before-close="handleDrawerClose" :modal="false">
            <el-form :model="params" inline label-width="180" label-position="right" style="margin: 0px 30px 0px 30px">
                <el-form-item prop="classesName" label="班级名称">
                    <el-input type="text" placeholder="请输入班级名称" v-model="params.classesName"></el-input>
                </el-form-item>
                <el-form-item prop="examName" label="试卷名称">
                    <el-input type="text" placeholder="请输入试卷名称" v-model="params.examName"></el-input>
                </el-form-item>
                <el-form-item prop="examType" label="试卷类型">
                    <el-select v-model="params.examType">
                        <el-option value="1" label="日测"></el-option>
                        <el-option value="2" label="周测"></el-option>
                        <el-option value="3" label="月考"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="examStatus" label="试卷状态">
                    <el-select v-model="params.examStatus">
                        <el-option value="1" label="未开始"></el-option>
                        <el-option value="2" label="进行中"></el-option>
                        <el-option value="3" label="批阅中"></el-option>
                        <el-option value="4" label="已结束"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="info" @click="reset"><i class="el-icon-search"></i> 重置</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>


        <exam-child ref="examChild"></exam-child>
        <exam-teacher-show ref="examTeacherShow"></exam-teacher-show>
        <exam-teacher-monitor ref="examTeacherMonitor"></exam-teacher-monitor>
        <exam-marking-writer ref="examMarkingWriter"></exam-marking-writer>
        <exam-analysis-score ref="examAnalysisScore"></exam-analysis-score>
        <exam-teacher-explain ref="examTeacherExplain"></exam-teacher-explain>
    </div>
</template>
<script>

    import * as examApi from '@/api/academic/exam.js'
    import { formatDate } from '@/utils/tools.js'
    export default {
        name:"exam-index",
        components:{
            ExamChild:()=>import("@/views/academic/exam/exam-child.vue"),
            ExamTeacherShow:()=>import("@/views/academic/exam/exam-teacher-show.vue"),
            ExamTeacherMonitor:()=>import("@/views/academic/exam/exam-teacher-monitor.vue"),
            ExamMarkingWriter:()=>import("@/views/academic/exam/exam-marking-writer.vue"),
            ExamAnalysisScore:()=>import("@/views/academic/exam/exam-analysis-score.vue"),
            ExamTeacherExplain:()=>import("@/views/academic/exam/exam-teacher-explain.vue")
        },
        data(){
            return {
                drawerValue:false,
                fullscreenLoading:false,
                loading:true,
                exams:[],
                params:{page:1,size:5,total:0},
                currentRow: null
            }
        },
        watch:{
            'params.classesName'(data){
                if(data){
                    this.getExamList(this.params);
                }
            },
            'params.examName'(data){
                if(data){
                    this.getExamList(this.params);
                }
            },
            'params.examType'(data){
                if(data){
                    this.getExamList(this.params);
                }
            },
            'params.examStatus'(data){
                if(data){
                    this.getExamList(this.params);
                }
            }
        },
        methods:{

            format(date){
                return formatDate(date);
            },
            reset(){
                this.params.classesName = null;
                this.params.examName = null;
                this.params.examType = null;
                this.params.examStatus = null;
                this.params.examPattern = null;
                this.getExamList(this.params);
            },
            handleDrawerClose(){
                this.params.classesName = null;
                this.params.examName =  null;
                this.params.examType =  null;
                this.params.examStatus = null;
                this.params.examPattern =  null;
              this.drawerValue = false;
            },
            openWindow(name){
                this.$refs[name].exam= {};
                this.$refs[name].value = true;
            },
            handleSizeChange(val){
                this.params.size = val;
                this.getExamList(this.params);
            },
            handlePageChange(val){
                this.params.page = val;
                this.getExamList(this.params);
            },
            getExamList(data){
                examApi.getExamList(data).then(res=>{
                    if(res.data.success){
                        this.exams = res.data.data.rows;
                        this.params.total = res.data.data.total;
                        this.loading = false;
                    }
                });
            },
            handleCurrentChange(val){
                this.currentRow = val;
            },
            startExam(){
                if(!this.currentRow){
                    this.$message.error("请选中一行");
                    return false;
                }
                this.fullscreenLoading = true;
                //当前行记录中有examStatus的值,直接判断就好,为什么还要查一次?
                //因为有可能后台定时器到时间会自动修改值,现在的行记录是旧值,无法获得examStatus的实际值,所有需要查询一次
                examApi.findById({id:this.currentRow.id}).then(res=>{
                    if(!res.data.success){
                        this.$message.error("非法操作,可能该试卷已经开始");
                        this.fullscreenLoading = false;
                        this.getExamList(this.params);
                        return false;
                    }else{
                        this.$confirm("确定要开启该试卷吗? 如果开启,学生则可以考试","友情提示",{type:'warning'}).then(()=>{
                            examApi.startExam(this.currentRow).then(res=>{
                                if(res.data.success){
                                    this.$message.success("开启考试成功," + this.currentRow.examTimeLength + "分钟后结束考试");
                                }else{
                                    this.$message.error(res.data.message);
                                }
                                this.fullscreenLoading = false;
                                this.getExamList(this.params);
                            }).catch(e=>{
                                this.$message.error("开始失败,失败原因:" + e);
                                this.fullscreenLoading = false;
                            })
                        });
                    }
                });
            },
            showExam(){
                if(!this.currentRow){
                    this.$message.error("请选中一行");
                    return false;
                }

                if(this.currentRow.examStatus != '2'){
                    this.$message.error("目前阶段无法查看");
                    return false;
                }

                this.$refs['examTeacherShow'].examData = {};
                this.$refs['examTeacherShow'].parentData = this.currentRow;
                this.$refs['examTeacherShow'].value = true;

            },
            monitorExam(){ //监控答题
                if(!this.currentRow){
                    this.$message.error("请选中一行");
                    return false;
                }

                if(this.currentRow.examStatus != '2'){
                    this.$message.error("只能查看进行中的试卷");
                    return false;
                }

                this.$refs['examTeacherMonitor'].parentData = this.currentRow;
                this.$refs['examTeacherMonitor'].value = true;

            },
            markingWriter(){ //批阅问答
                if(!this.currentRow){
                    this.$message.error("请选中一行");
                    return false;
                }

                if(this.currentRow.examStatus != '3'){
                    this.$message.error("只能批阅带有问答题的试卷");
                    return false;
                }

                this.$refs['examMarkingWriter'].parentData = this.currentRow;
                this.$refs['examMarkingWriter'].value = true;
            },
            analysisScore(){
                if(!this.currentRow){
                    this.$message.error("请选中一行");
                    return false;
                }

                if(this.currentRow.examStatus != '4'){
                    this.$message.error("目前阶段无法查看");
                    return false;
                }

                this.$refs['examAnalysisScore'].parentData = this.currentRow;
                this.$refs['examAnalysisScore'].value = true;
            },
            explainExam(){
                if(!this.currentRow){
                    this.$message.error("请选中一行");
                    return false;
                }

                if(this.currentRow.examStatus != '4'){
                    this.$message.error("目前阶段无法查看");
                    return false;
                }

                this.$refs['examTeacherExplain'].parentData = this.currentRow;
                this.$refs['examTeacherExplain'].value = true;

            }
        },
        created(){
            this.currentRow = null;
            this.getExamList(this.params);
        }
    }
</script>
<style scoped>

</style>