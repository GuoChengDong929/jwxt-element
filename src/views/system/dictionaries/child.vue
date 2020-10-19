<template>
    <el-dialog title="字典页面" style="background: #F0F0F0;" :close-on-click-modal="false" :close-on-press-escape="false"  :visible.sync="value" :show-close="false" :center="true">
        <el-form ref="form" label-position="right" label-width="80px" :model="dictionaries" :rules="rules">
            <el-form-item prop="name" label="字典名称">
                <el-input type="text" v-model="dictionaries.name" placeholder="请输入字典名称"></el-input>
            </el-form-item>
            <el-form-item prop="code" label="字典代码">
                <el-input type="text" v-model="dictionaries.code" placeholder="请输入字典代码"></el-input>
            </el-form-item>
            <el-form-item prop="useScenarios" label="使用场景">
                <el-input type="text" v-model="dictionaries.useScenarios" placeholder="请输入使用场景"></el-input>
            </el-form-item>
            <el-form-item prop="description" label="字典描述">
                <el-input type="textarea" v-model="dictionaries.description" placeholder="请输入字典描述"></el-input>
            </el-form-item>
        </el-form>

        <template slot="footer">
            <el-button type="infor" @click="value = false" plain><span class="el-icon-bell"></span>取消</el-button>
            <el-button type="success" @click="handleSubmit" plain><span class="el-icon-loading"></span>提交</el-button>
        </template>
    </el-dialog>
</template>

<script>

    import { saveOrUpdate } from '@/api/system/dictionaries.js'

    export default {
        name:'dictionaries-child',
        data(){
            return {
                dictionaries: {},
                value: false
            }
        },
        props:{
            nameRule:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必填项',trigger:'blur'}
                    ]
                }
            },
            codeRule:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必填项',trigger:'blur'}
                    ]
                }
            },
            useScenariosRule:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必填项',trigger:'blur'}
                    ]
                }
            },
            descriptionRule:{
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
                    name: this.nameRule,
                    code: this.codeRule,
                    useScenarios: this.useScenariosRule,
                    description: this.descriptionRule
                }
            }
        },
        methods:{
            handleSubmit(){
                this.$refs['form'].validate(valid=>{
                    if(valid){
                        saveOrUpdate(this.dictionaries).then(res=>{
                            this.$message({
                                type:res.data.success ? 'success' : "error",
                                message: res.data.message
                            });
                            this.value = false;
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