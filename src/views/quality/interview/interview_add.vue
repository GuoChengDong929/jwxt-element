<template>
    <el-dialog :title="value" :visible.sync="dialogVisible" :show-close="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" width="600px">
        <el-form ref="form" :model="InterviewObject" :rules="rules" label-width="150px">
            <el-form-item prop="classesId" label="所带班级">
                <el-select v-model="InterviewObject.classesId" style="width: 300px" @change="classesChange">
                    <el-option :value="item.id" :label="item.classesName" :key="item.id"
                               v-for="item in classesList"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="studentId" label="班级学生">
                <el-select v-model="InterviewObject.studentId" style="width: 300px" :disabled="studentList.length == 0">
                    <el-option :value="item.id" :label="item.nickName" :key="item.id"
                               v-for="item in studentList"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="interviewAddress" label="访谈地点">
                <el-select style="width: 300px" v-model="InterviewObject.interviewAddress">
                    <el-option label="项目一" value="项目一"></el-option>
                    <el-option label="项目二" value="项目二"></el-option>
                    <el-option label="项目三" value="项目三"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="interviewObjective" label="访谈目的">
                <el-input type="text" style="width: 300px" v-model="InterviewObject.interviewObjective" placeholder="请输入访谈目的"></el-input>
            </el-form-item>
            <el-form-item prop="interviewContent" label="访谈内容">
                <el-input type="textarea" style="width: 300px" v-model="InterviewObject.interviewContent" placeholder="请输入访谈内容"></el-input>
            </el-form-item>
            <el-form-item prop="interviewResults" label="访谈结果">
                <el-input type="textarea" style="width: 300px" v-model="InterviewObject.interviewResults" placeholder="请输入访谈结果"></el-input>
            </el-form-item>
        </el-form>
        <template slot="footer">
            <el-button type="success" plain @click="handleSubmit">提交</el-button>
            <el-button @click="cancel">取  消</el-button>
        </template>
    </el-dialog>
</template>

<script>

    import {getStudentListByClassesId} from '@/api/quality/student/student.js'
    import {saveInterview} from "@/api/quality/interview/interview";

    export default {
        name: "interview_add",
        data() {
            return {
                value:null,
                dialogVisible: false,
                InterviewObject: {},
                classesList: [],
                studentList: [],
                selectClassesId: '',
                rules: {
                    interviewAddress: [
                        {required: true, message: '不能为空！', trigger: 'blur'},
                    ],
                    interviewObjective: [
                        {required: true, message: '不能为空！', trigger: 'blur'},
                    ],
                    interviewContent: [
                        {required: true, message: '不能为空！', trigger: 'blur'},
                    ],
                    interviewResults: [
                        {required: true, message: '不能为空！', trigger: 'blur'},
                    ],
                    classesId: [
                        {required: true, message: '不能为空！', trigger: 'blur'},
                    ],
                    studentId: [
                        {required: true, message: '不能为空！', trigger: 'blur'},
                    ],
                }
            }
        },
        methods: {
            cancel(){
                this.InterviewObject={};
                this.dialogVisible=false;
                this.$parent.findAll();
            },
            classesChange(val) {
                this.selectClassesId = val;
                this.getStudent();
            },
            handleSubmit() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        saveInterview(this.InterviewObject).then(res => {
                            this.$message({
                                type: res.data.success ? 'success' : 'error',
                                message: res.data.message
                            });
                            this.dialogVisible = false;
                            this.InterviewObject={};
                            this.$parent.findAll();
                        })
                    } else {
                        return false;
                    }
                })
            },
            getStudent() {
                getStudentListByClassesId({id: this.selectClassesId}).then(res => {
                    this.studentList = res.data.data;
                })
            }
        }
    }
</script>

<style scoped>

</style>