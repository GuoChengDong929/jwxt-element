<template>
    <div>
        <el-dialog title="单选题" style="background: #F0F0F0" :close-on-click-modal="false" :close-on-press-escape="false"  :visible.sync="value" :show-close="false" :center="true">
            <el-form ref="form" :model="single" :rules="rules" label-position="right" label-width="80px">

                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="discipline" label="学科编号">
                            <el-radio-group v-model="single.discipline">
                                <el-radio label="1">软件专业</el-radio>
                                <el-radio label="2">网络专业</el-radio>
                                <el-radio label="3">所有通用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="chapterId" label="所属章节">
                            <el-select v-model="single.chapterId" clearable filterable style="margin-right:10px" placeholder="请选择试题所在章节">
                                <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in chapterData"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="sourced" label="试题来源">
                            <el-radio-group v-model="single.sourced">
                                <el-radio label="1">课程试题</el-radio>
                                <el-radio label="2">面试宝典</el-radio>
                                <el-radio label="3">企业真题</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="companyId" label="企业名称" :style="{'display':sourcedHiddenValue}" error="请选择企业" :required="(single.sourced && single.sourced.includes('3')) ? true : false">
                            <el-select v-model="single.companyId" clearable filterable style="margin-right:10px" placeholder="请选择企业">
                                <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in companyData"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="singleContent" label="试题题干">
                            <el-input type="textarea" v-model="single.singleContent" placeholder="请输入单选题题干"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
               <el-row>
                    <el-col :span="24">
                        <el-form-item prop="singleOptionA" label="选项A组">
                            <el-input type="text" v-model="single.singleOptionA" placeholder="请输入单选题选项A组"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="singleOptionB" label="选项B组">
                            <el-input type="text" v-model="single.singleOptionB" placeholder="请输入单选题选项B组"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="singleOptionC" label="选项C组">
                            <el-input type="text" v-model="single.singleOptionC" placeholder="请输入单选题选项C组"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="singleOptionD" label="选项D组">
                            <el-input type="text" v-model="single.singleOptionD" placeholder="请输入单选题选项D组"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="singleAsk" label="试题答案">
                            <el-radio-group v-model="single.singleAsk">
                                <el-radio label="1">A</el-radio>
                                <el-radio label="2">B</el-radio>
                                <el-radio label="3">C</el-radio>
                                <el-radio label="4">D</el-radio>
                            </el-radio-group>
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
        name:'single-child',
        data(){
            return {
                single: {},
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
            singleContentRule:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必填项',trigger:'blur'}
                    ]
                }
            },
            singleOptionARule:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必填项',trigger:'blur'}
                    ]
                }
            },
            singleOptionBRule:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必填项',trigger:'blur'}
                    ]
                }
            },
            singleOptionCRule:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必填项',trigger:'blur'}
                    ]
                }
            },
            singleOptionDRule:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必填项',trigger:'blur'}
                    ]
                }
            },
            singleAskRule:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必选项',trigger:'change'}
                    ]
                }
            },
        },
        computed:{
            rules(){
                return {
                    discipline: this.disciplineRule,
                    chapterId: this.chapterRule,
                    sourced: this.sourcedRule,
                    singleContent: this.singleContentRule,
                    singleOptionA: this.singleOptionARule,
                    singleOptionB: this.singleOptionBRule,
                    singleOptionC: this.singleOptionCRule,
                    singleOptionD: this.singleOptionDRule,
                    singleAsk: this.singleAskRule
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
            'single.sourced'(data){
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

                        this.single.type = '1';

                        saveOrUpdate(this.single).then(res=>{
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