<template>
    <div>
        <el-dialog title="考试出题" style="background: #F0F0F0" :close-on-click-modal="false" :close-on-press-escape="false"  :visible.sync="value" :show-close="false" :center="true">
            <el-form ref="form" :model="exam" :rules="rules" label-position="right" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="classesId" label="考试班级">
                            <el-select v-model="exam.classesId">
                                <el-option :key="item.id" :value="item.id" :label="item.classesName" v-for="item in classesData"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="examName" label="试卷名称">
                            <el-input type="text" v-model="exam.examName" placeholder="示例: Y201班20191201"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="examTime" label="考试时间">
                            <el-date-picker v-model="exam.examTime" placeholder="比当前时间提前12分钟" type="datetime"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="examTimeLength" label="考试时长">
                            <el-input-number v-model="exam.examTimeLength" :min="40" :max="360" label="请选择或输入考试时长"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="examType" label="试卷类型">
                            <el-radio-group v-model="exam.examType">
                                <el-radio label="1">日测</el-radio>
                                <el-radio label="2">周测</el-radio>
                                <el-radio label="3">月考</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="examPattern" label="试卷模式">
                            <el-radio-group v-model="exam.examPattern" @change="examTypeChange">
                                <el-radio label="1">手动出题</el-radio>
                                <el-radio label="2">自动出题</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="exam.examPattern =='2'">
                    <el-col :span="12">
                        <el-form-item label="单选数量">
                            <el-input   v-model="autoExam.singleCount" disabled style="width:220px"></el-input>
                        </el-form-item>
                    </el-col>
                     <el-col :span="12">
                        <el-form-item label="单选分数">
                            <el-input  v-model="autoExam.singleScore" disabled style="width:220px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="exam.examPattern =='2'">
                    <el-col :span="12">
                        <el-form-item label="多选数量">
                            <el-input  v-model="autoExam.selectionCount" disabled style="width:220px"></el-input>
                        </el-form-item>
                    </el-col>
                     <el-col :span="12">
                        <el-form-item label="多选分数">
                            <el-input  v-model="autoExam.selectionScore" disabled style="width:220px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row v-if="exam.examPattern =='2'">
                    <el-col :span="12">
                        <el-form-item label="问答数量">
                            <el-input  v-model="autoExam.askCount" disabled style="width:220px"></el-input>
                        </el-form-item>
                    </el-col>
                     <el-col :span="12">
                        <el-form-item label="问答分数">
                            <el-input v-model="autoExam.askScore" disabled style="width:220px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="exam.examPattern =='1'">
                    <el-col :span="12">
                        <el-form-item label="单选数量">
                            <el-input   v-model="noAutoExam.singleCount" disabled style="width:220px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="单选分数">
                            <el-input  v-model="noAutoExam.singleScore"  :disabled="noAutoExam.singleCount>0 ? false:true" style="width:220px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="exam.examPattern =='1'">
                    <el-col :span="12">
                        <el-form-item label="多选数量">
                            <el-input  v-model="noAutoExam.selectionCount" disabled style="width:220px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="多选分数">
                            <el-input  v-model="noAutoExam.selectionScore" :disabled="noAutoExam.selectionCount>0 ? false:true" style="width:220px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row v-if="exam.examPattern =='1'">
                    <el-col :span="12">
                        <el-form-item label="问答数量">
                            <el-input  v-model="noAutoExam.askCount" disabled style="width:220px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="问答分数">
                            <el-input v-model="noAutoExam.askScore" :disabled="noAutoExam.askCount>0 ? false:true" style="width:220px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template slot="footer">
                <el-button type="info" plain @click="handleCancel"><i class="el-icon-bell"></i>取消</el-button>
                <el-button type="success" plain @click="handleSubmit"  v-loading.fullscreen.lock="fullscreenLoading" ><i class="el-icon-loading"></i>提交</el-button>
            </template>
        </el-dialog>
        <exam-auto-child ref="examAutoChild"></exam-auto-child>
        <exam-no-auto-child ref="examNoAutoChild"></exam-no-auto-child>
    </div>
</template>
<script>
    import { findAll } from '@/api/quality/transact/classes.js'
    import { saveExam } from '@/api/academic/exam.js'

    import { formatDateNoWeek } from '@/utils/tools.js'

    export default {
        name:'ask-child',
        components:{
            ExamAutoChild:()=>import("@/views/academic/exam/exam-auto-child.vue"),
            ExamNoAutoChild:()=>import("@/views/academic/exam/exam-no-auto-child.vue"),
        },
        data(){
            return {
                fullscreenLoading:false,
                value : false,
                exam: {},
                autoExam: {},    //自动出题
                noAutoExam: {
                    singleIds: [],
                    selectionIds: [],
                    askIds: []
                }, //手动出题
                classesData: []
            }
        },
        props:{
            classesIdRule:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必选项',trigger:'change'}
                    ]
                }
            },
            examNameRule:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必输项',trigger:'blur'}
                    ]
                }
            },
            examTimeRule:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必选项',trigger:'change'}
                    ]
                }
            },
            examTypeRule:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必选项',trigger:'change'}
                    ]
                }
            },
            examPatternRule:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必选项',trigger:'change'}
                    ]
                }
            },
            examTimeLengthRule:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必输项',trigger:'blur'}
                    ]
                }
            }
        },
        computed:{
            rules(){
                return {
                   classesId: this.classesIdRule,
                   examName: this.examNameRule,
                   examTime: this.examTimeRule,
                   examType: this.examTypeRule,
                   examPattern: this.examPatternRule,
                   examTimeLength: this.examTimeLengthRule
                }
            }
        },
        watch:{
            value(data){
                if(data){
                    findAll().then(res=>{
                        if(res.data.success){
                            this.classesData = res.data.data;
                        }
                    });
                }
            },
            
        },
        methods:{
            examTypeChange(val){
                if(val == '1'){
                    this.$refs['examNoAutoChild'].params.name = "";
                    this.$refs['examNoAutoChild'].singleIds = [];
                    this.$refs['examNoAutoChild'].selectionIds = [];
                    this.$refs['examNoAutoChild'].askIds = [];
                    this.$refs['examNoAutoChild'].chapterData = [];
                    this.$refs['examNoAutoChild'].checkedChapterIdArray = [];
                    this.$refs['examNoAutoChild'].checkedQuestionTypeArray = [];
                    this.$refs['examNoAutoChild'].searchData = {singleList:[],selectionList:[],askList:[]};
                    this.$refs['examNoAutoChild'].data = {};
                    this.$refs['examNoAutoChild'].value = true;
                }else if(val == '2'){
                    this.$refs['examAutoChild'].chapterData = [];
                    this.$refs['examAutoChild'].checkedChapterIdArray = [];
                    this.$refs['examAutoChild'].checkedQuestionTypeArray = [];
                    this.$refs['examAutoChild'].searchData = {singleList:[],selectionList:[],askList:[]};
                    this.$refs['examAutoChild'].count = {single:0,selection:0,ask:0};
                    this.$refs['examAutoChild'].data = {};
                    this.$refs['examAutoChild'].value = true;
                }
            },
            handleCancel(){
                this.fullscreenLoading = false;
                this.value = false
            },
            handleSubmit(){
                this.$refs['form'].validate(valid=>{
                    if(valid){
                        if(this.exam.examPattern == '1'){ //手动出题
                            this.exam = Object.assign(this.exam,this.noAutoExam);
                            let sum = 0;
                            if(this.exam.questionTypeIds.includes("1")){
                                if(!this.exam.singleScore){
                                    this.$message.warning("请给出单选题分数");
                                    return false;
                                }
                                if(this.exam.singleScore <= 0){
                                    this.$message.warning("请给出单选题分数不能小于等于0");
                                    return false;
                                }
                                sum = sum + parseInt(this.exam.singleCount) * parseInt(this.exam.singleScore)
                            }

                            if(this.exam.questionTypeIds.includes("2")){
                                if(!this.exam.selectionScore){
                                    this.$message.warning("请给出多选题分数");
                                    return false;
                                }
                                if(this.exam.selectionScore <= 0){
                                    this.$message.warning("请给出多选题分数不能小于等于0");
                                    return false;
                                }
                                sum = sum + parseInt(this.exam.selectionCount) * parseInt(this.exam.selectionScore)
                            }

                            if(this.exam.questionTypeIds.includes("3")){
                                if(!this.exam.askScore){
                                    this.$message.warning("请给出问答题分数");
                                    return false;
                                }
                                if(this.exam.askScore <= 0){
                                    this.$message.warning("请给出问答题分数不能小于等于0");
                                    return false;
                                }
                                sum = sum + parseInt(this.exam.askCount) * parseInt(this.exam.askScore)
                            }

                            if(sum != 100){
                                this.$message.error("总分必须是100分");
                                return false;
                            }

                        }else if(this.exam.examPattern == '2'){ //自动出题
                            this.exam = Object.assign(this.exam,this.autoExam);
                        }
                
                        this.exam.examTime = formatDateNoWeek(this.exam.examTime);

                        this.fullscreenLoading = true;

                        saveExam(this.exam).then(res=>{
                            this.$message({
                                type:res.data.success ? 'success':'error',
                                message:res.data.message
                            });

                            this.value = false;
                            this.$parent.getExamList(this.$parent.params);
                        }).catch(e=>{
                            this.$message.error("新增错误,错误原因" + e);
                            this.fullscreenLoading = false;
                        });
                    }else{
                        return false;
                    }

                    this.fullscreenLoading = false;
                });
            }
        }
    }
</script>
<style scoped>

</style>