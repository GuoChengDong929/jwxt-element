<template>
    <div>
        <el-dialog title="多选题" style="background: #F0F0F0" :close-on-click-modal="false" :close-on-press-escape="false"  :visible.sync="value" :show-close="false" :center="true">
            <el-form ref="form" :model="selection" :rules="rules" label-position="right" label-width="80px">

                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="discipline" label="学科编号">
                            <el-radio-group v-model="selection.discipline">
                                <el-radio label="1">软件专业</el-radio>
                                <el-radio label="2">网络专业</el-radio>
                                <el-radio label="3">所有通用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="chapterId" label="所属章节">
                            <el-select v-model="selection.chapterId" clearable filterable style="margin-right:10px" placeholder="请选择试题所在章节">
                                <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in chapterData"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="sourced" label="试题来源">
                            <el-radio-group v-model="selection.sourced">
                                <el-radio label="1">课程试题</el-radio>
                                <el-radio label="2">面试宝典</el-radio>
                                <el-radio label="3">企业真题</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="companyId" label="企业名称" :style="{'display':sourcedHiddenValue}" error="请选择企业" :required="(selection.sourced && selection.sourced.includes('3')) ? true : false">
                            <el-select v-model="selection.companyId" clearable filterable style="margin-right:10px" placeholder="请选择企业">
                                <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in companyData"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="selectionContent" label="试题题干">
                            <el-input type="textarea" v-model="selection.selectionContent" placeholder="请输入多选题题干"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
               <el-row>
                    <el-col :span="24">
                        <el-form-item prop="selectionOptionA" label="选项A组">
                            <el-input type="text" v-model="selection.selectionOptionA" placeholder="请输入多选题选项A组"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="selectionOptionB" label="选项B组">
                            <el-input type="text" v-model="selection.selectionOptionB" placeholder="请输入多选题选项B组"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="selectionOptionC" label="选项C组">
                            <el-input type="text" v-model="selection.selectionOptionC" placeholder="请输入多选题选项C组"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="selectionOptionD" label="选项D组">
                            <el-input type="text" v-model="selection.selectionOptionD" placeholder="请输入多选题选项D组"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="selectionAskList" label="试题答案">
                            <el-checkbox-group v-model="selectionAskList">
                                <el-checkbox label="1">A</el-checkbox>
                                <el-checkbox label="2">B</el-checkbox>
                                <el-checkbox label="3">C</el-checkbox>
                                <el-checkbox label="4">D</el-checkbox>
                            </el-checkbox-group>
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
        name:'selection-child',
        data(){
            return {
                selectionAskList:[],
                selection: {},
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
            selectionContentRule:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必填项',trigger:'blur'}
                    ]
                }
            },
            selectionOptionARule:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必填项',trigger:'blur'}
                    ]
                }
            },
            selectionOptionBRule:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必填项',trigger:'blur'}
                    ]
                }
            },
            selectionOptionCRule:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必填项',trigger:'blur'}
                    ]
                }
            },
            selectionOptionDRule:{
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
                    selectionContent: this.selectionContentRule,
                    selectionOptionA: this.selectionOptionARule,
                    selectionOptionB: this.selectionOptionBRule,
                    selectionOptionC: this.selectionOptionCRule,
                    selectionOptionD: this.selectionOptionDRule
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
            'selection.sourced'(data){
                if(data && data == '3'){
                    this.sourcedHiddenValue = 'block';
                }else{
                    this.sourcedHiddenValue = 'none';
                }
            },
            'selection.id'(data){ //用户多选题答案回显
                if(data){
                    this.selectionAskList = this.selection.selectionAsk.split(",");
                }
            }
        },
        methods:{
            handleSubmit(){
                this.$refs['form'].validate(valid=>{
                    if(valid){

                        if(this.selectionAskList.length < 2){
                            this.$message.error("请选择至少两个答案");
                            return false;
                        }

                        this.selectionAskList.sort((a, b) => a - b);  //对答案排序 1,2,3,4
                
                        this.selection.selectionAsk = this.selectionAskList.join(',');

                        this.selection.type = '2';

                        saveOrUpdate(this.selection).then(res=>{
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