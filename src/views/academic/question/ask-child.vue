<template>
    <div>
        <el-dialog title="问答题" style="background: #F0F0F0" :close-on-click-modal="false" :close-on-press-escape="false"  :visible.sync="value" :show-close="false" :center="true">
            <el-form ref="form" :model="ask" :rules="rules" label-position="right" label-width="80px">

                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="discipline" label="学科编号">
                            <el-radio-group v-model="ask.discipline">
                                <el-radio label="1">软件专业</el-radio>
                                <el-radio label="2">网络专业</el-radio>
                                <el-radio label="3">所有通用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="chapterId" label="所属章节">
                            <el-select v-model="ask.chapterId" clearable filterable style="margin-right:10px" placeholder="请选择试题所在章节">
                                <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in chapterData"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="sourced" label="试题来源">
                            <el-radio-group v-model="ask.sourced">
                                <el-radio label="1">课程试题</el-radio>
                                <el-radio label="2">面试宝典</el-radio>
                                <el-radio label="3">企业真题</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="companyId" label="企业名称" :style="{'display':sourcedHiddenValue}" error="请选择企业" :required="(ask.sourced && ask.sourced.includes('3')) ? true : false">
                            <el-select v-model="ask.companyId" clearable filterable style="margin-right:10px" placeholder="请选择企业">
                                <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in companyData"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="askContent" label="试题题干">
                            <el-input type="textarea" v-model="ask.askContent" placeholder="请输入问答题题干"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="askAnalysis" label="试题解析">
                            <el-input type="textarea" v-model="ask.askAnalysis" placeholder="请输入问答题解析"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template slot="footer">
                <el-button type="info" plain @click="value = false"><i class="el-icon-bell"></i>取消</el-button>
                <el-button type="success" plain @click="handleSubmit"><i class="el-icon-loading"></i>提交</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script>

    import { findChapters } from '@/api/academic/chapter.js'

    import { getCompanies } from '@/api/work/company.js'

    import { saveOrUpdate } from '@/api/academic/question.js'

    export default {
        name:'ask-child',
        data(){
            return {
                ask: {},
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
            askContentRule:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必填项',trigger:'blur'}
                    ]
                }
            },
            askAnalysisRule:{
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
                    askAnalysis:this.askAnalysisRule,
                    askContent:this.askContentRule
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
                }
            },
            'ask.sourced'(data){
                if(data && data == '3'){
                    this.sourcedHiddenValue = 'block';
                }else{
                    this.sourcedHiddenValue = 'none';
                }
            }
        },
        methods:{
            handleSubmit(){
                this.$refs['form'].validate(valid=>{
                    if(valid){

                        this.ask.type = '3';

                        saveOrUpdate(this.ask).then(res=>{
                            this.$message({
                                type:res.data.success ? 'success' : 'error',
                                message: res.data.message
                            });
                            this.value = false;
                            this.$parent.getList(this.$parent.params);
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