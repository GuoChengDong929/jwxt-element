<template>
    <div>
        <el-dialog title="上机题" style="background: #F0F0F0" :close-on-click-modal="false" :close-on-press-escape="false"  :visible.sync="value" :show-close="false" :center="true">
            <el-form ref="form" :model="upper" :rules="rules" label-position="right" label-width="80px">

                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="discipline" label="学科编号">
                            <el-radio-group v-model="upper.discipline">
                                <el-radio label="1">软件专业</el-radio>
                                <el-radio label="2">网络专业</el-radio>
                                <el-radio label="3">所有通用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="chapterId" label="所属章节">
                            <el-select v-model="upper.chapterId" clearable filterable style="margin-right:10px" placeholder="请选择试题所在章节">
                                <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in chapterData"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="sourced" label="试题来源">
                            <el-radio-group v-model="upper.sourced">
                                <el-radio label="1">课程试题</el-radio>
                                <el-radio label="2">面试宝典</el-radio>
                                <el-radio label="3">企业真题</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="companyId" label="企业名称" :style="{'display':sourcedHiddenValue}" error="请选择企业" :required="(upper.sourced && upper.sourced.includes('3')) ? true : false">
                            <el-select v-model="upper.companyId" clearable filterable style="margin-right:10px" placeholder="请选择企业">
                                <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in companyData"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="upperContent" label="试题题干">
                            <el-input type="textarea" v-model="upper.upperContent" placeholder="请输入上机题题干"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="upperAnalysis" label="试题解析">
                            <el-input type="textarea" v-model="upper.upperAnalysis" placeholder="请输入上机题解析"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="upperUrl" label="试题资料">
                            <!--
                                :before-upload="beforeAvatarUpload"
                                :limit="1"   上传文件的个数
                                :auto-upload="false" 上传文件时,不自动提交,而是通过提交表单时,提交文件的上传
                                list-type="picture" picture text picture-card 文件列表的类型(如何展示)
                                :headers="{'Authorization': token()}" 上传请求的头部信息
                                drag 是否可以拖拽文件
                                action 接口地址
                                :on-exceed="uploadExceed" 上传文件超过个数的钩子
                                :on-change="uploadChange" 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
                                :on-success	文件上传成功时的钩子	function(response, file, fileList)
                                :on-error	文件上传失败时的钩子	function(err, file, fileList)
                                :on-progress	文件上传时的钩子	function(event, file, fileList)
                            -->
                            <el-upload
                                ref="upload"
                                name="file"
                                :limit="1"
                                :auto-upload="false"
                                class="upload-demo"
                                list-type="text"
                                :file-list="fileList"
                                :headers="{'Authorization': token()}"
                                drag
                                action="http://192.168.18.250:56700/question/upload"
                                :on-success="uploadSuccess"
                                :on-exceed="uploadExceed"
                                :on-change="uploadChange"
                                :on-error="uploadError"
                            >
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__text"><em>点击上传</em></div>
                                <div class="el-upload__tip" slot="tip">只能上传zip文件，且不超过50MB</div>
                            </el-upload>
                        </el-form-item>
                        
                    </el-col>
                </el-row>
            </el-form>
            <template slot="footer">
                <el-button type="info" plain @click="value = false"><i class="el-icon-bell"></i>取消</el-button>
                <el-button type="success" plain @click="handleSubmit" v-loading.fullscreen.lock="fullscreenLoading" ><i class="el-icon-loading"></i>提交</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script>

    import { getToken } from '@/utils/tools';

    import { findChapters } from '@/api/academic/chapter.js'

    import { getCompanies } from '@/api/work/company.js'

    import { saveOrUpdate } from '@/api/academic/question.js'

    export default {
        name:'upper-child',
        data(){
            return {
                fullscreenLoading:false,
                upper: {},
                fileList:[],
                sourcedHiddenValue:"none",
                value: false,
                chapterData:[],
                companyData:[]
            }
        },
        props:{
            disciplineRule:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必选项',trigger:'change'}
                    ]
                }
            },
            chapterRule:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必选项',trigger:'change'}
                    ]
                }
            },
            sourcedRule:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必选项',trigger:'change'}
                    ]
                }
            },
            upperContentRule:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必填项',trigger:'blur'}
                    ]
                }
            },
            upperAnalysisRule:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必填项',trigger:'blur'}
                    ]
                }
            }
        },
        computed:{
            rules(){
                return {
                    discipline: this.disciplineRule,
                    chapterId: this.chapterRule,
                    sourced: this.sourcedRule,
                    upperAnalysis:this.upperAnalysisRule,
                    upperContent:this.upperContentRule
                }
            }
        },
        watch:{
            value(data){
                if(data){

                    findChapters().then(res=>{
                        if(res.data.success){
                            this.chapterData = res.data.data;
                        }
                    });

                    getCompanies().then(res=>{
                        if(res.data.success){
                            this.companyData = res.data.data;
                        }
                    });


                    if(this.$refs.upload && this.$refs.upload.uploadFiles){
                        this.$refs.upload.uploadFiles = []; //清空未上传的文件列表
                    }

                }
            },
            'upper.sourced'(data){
                if(data && data == '3'){
                    this.sourcedHiddenValue = 'block';
                }else{
                    this.sourcedHiddenValue = 'none';
                }
            }
        },
        methods:{
            uploadSuccess(response,file,filelist){ //response中有该上机题的id 通过id进行表单数据的修改
                if(response.success){
                    this.upper.id = response.data.id;
                    this.upper.type = '4';
                    saveOrUpdate(this.upper).then(res=>{
                        this.$message({
                            type:res.data.success ? 'success' : 'error',
                            message: res.data.message
                        });
                        this.fullscreenLoading = false;
                        this.value = false;
                        this.$parent.getList(this.$parent.params);
                    });
                }
            },
            uploadError(err,file,fileList){
                this.$message.error(file.name + "文件上传失败");
                return false;
            },
            uploadExceed(){
                this.$message.error("上传的文件超出了限定了个数");
                return false;
            },
            uploadChange(file,fileList){
                
                if( !(file.raw.type === 'application/x-zip-compressed')){
                    this.$refs.upload.uploadFiles = [];
                    this.$message.error("只能上传ZIP文件");
                    return false;
                }
                if(file.size / 1024 / 1024 > 50){
                    this.$refs.upload.uploadFiles = [];
                    this.$message.error("上传的文件不能超过50MB");
                    return false;
                }

            },
            token(){
                return getToken();
            },
            handleSubmit(){
                this.$refs['form'].validate(valid=>{
                    if(valid){

                        if(this.$refs.upload.uploadFiles.length != 1){
                            this.$message.error("请选择文件");
                            return false;
                        }

                        this.$confirm("文件一旦提交,该上机题所有信息将无法修改,你确定提交吗?","友情提示",{type:'warning'}).then(()=>{
                            this.fullscreenLoading = true;
                            this.$refs.upload.submit();
                        });
                    }else{
                        return false;
                    }
                });
                
            }
        }
    }
</script>
<style scoped>

</style>