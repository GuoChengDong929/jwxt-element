<template>
    <el-dialog title="班级信息" style="background: #F0F0F0;" :close-on-click-modal="false" :close-on-press-escape="false"  :visible.sync="value" :show-close="false" :center="true">
        
        <el-form ref="form" :model="classes" label-position="right" inline label-width="150px" :rules="rules" size="mini">
            <el-form-item prop="classesName" label="班级名称">
                <el-input type="text" placeholder="请输入班级名称" v-model="classes.classesName"></el-input>
            </el-form-item>
            
            <el-form-item prop="curriculumId" label="所属阶段">
                <el-select v-model="classes.curriculumId">
                    <el-option :key="item.id" :value="item.id" :label="item.name" v-for="item in curriculumData"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="jyId" label="带班教员">
                 <el-select v-model="classes.jyId">
                    <el-option :key="item.id" :value="item.id" :label="item.nickName" v-for="item in teachers.jyTeacher"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="bzrId" label="带班班任">
                <el-select v-model="classes.bzrId">
                    <el-option :key="item.id" :value="item.id" :label="item.nickName" v-for="item in teachers.bzrTeacher"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="zjId" label="带班助教">
                <el-select v-model="classes.zjId">
                    <el-option :key="item.id" :value="item.id" :label="item.nickName" v-for="item in teachers.zjTeacher"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="startTime" label="开班时间">
                <el-date-picker type="datetime" placeholder="请选择开班时间" v-model="classes.startTime" size="mini"></el-date-picker>
            </el-form-item>
            <el-form-item prop="endTime" label="结束时间">
                <el-date-picker type="datetime" placeholder="请选择结束时间" v-model="classes.endTime" size="mini"></el-date-picker>
            </el-form-item>
        </el-form>


        <template slot="footer">
            <el-button type="info" @click="value = false" plain><span class="el-icon-bell"></span>取消</el-button>
            <el-button type="success" @click="handleSubmit" plain><span class="el-icon-loading"></span>提交</el-button>
        </template>

    </el-dialog>
</template>
<script>

    import { findAll } from '@/api/academic/curriculum.js'

    import { findTeachersByJobTitle } from '@/api/quality/other/teacher.js'

    import { saveOrUpdate } from '@/api/quality/transact/classes.js'


    export default {
        name: 'classes-child',
        data(){
            return {
                classes:{},
                value : false,
                curriculumData:[],
                teachers:{
                    jyTeacher:[],
                    zjTeacher:[],
                    bzrTeacher:[]
                }
            }
        },
        props:{

        },
        computed:{
            rules(){
                return {

                }
            }
        },
        watch:{
            value(data){
                if(data){
                    findAll().then(res=>{
                        this.curriculumData = res.data.data;
                    });
                    findTeachersByJobTitle().then(res=>{
                        this.teachers = res.data.data;
                    });
                }
            }
        },
        methods:{
            handleSubmit(){
                this.$refs['form'].validate(valid=>{
                    if(valid){
                        saveOrUpdate(this.classes).then(res=>{
                            this.$message({
                                type:res.data.success ? 'success' : 'error',
                                message: res.data.message
                            });
                            this.value = false;
                            this.$parent.getClassesList(this.$parent.params);
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