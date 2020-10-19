<template>
    <div>
        <el-dialog :visible.sync="value" fullscreen center	>
            <template slot="title">
                <el-button type="info" plain @click="getStudentListByExam(parentData)"> <i class="el-icon-refresh"></i> 刷新列表</el-button>
                <el-button type="danger" plain @click="stopExam"> <i class="el-icon-thumb"></i> 停止考试</el-button>
            </template>

            <el-table :data="studentData" :loading="loading">
                <el-table-column type="index" label="序号" align="center"></el-table-column>
                <el-table-column prop="studentName" label="学生姓名" align="center"></el-table-column>
                <el-table-column label="单选题" align="center">
                    <el-table-column prop="singleErr" label="错题数量" align="center"></el-table-column>
                    <el-table-column prop="singleSucc" label="对题数量" align="center"></el-table-column>
                </el-table-column>
                <el-table-column label="多选题" align="center">
                    <el-table-column prop="selectionErr" label="错题数量" align="center"></el-table-column>
                    <el-table-column prop="selectionSucc" label="对题数量" align="center"></el-table-column>
                </el-table-column>
                <el-table-column prop="status" label="交卷与否" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status == '0' ? 'info' :( scope.row.status == '1' ? 'danger' : 'success' )">
                            {{scope.row.status == '0' ? '未答题' : ( scope.row.status == '1' ? '进行中' : '已交卷')}}
                        </el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>

    import { getStudentListByExam,stop } from '@/api/academic/exam.js'

    export default {
        name:'exam-teacher-monitor',
        data(){
            return {
                loading:true,
                value : false,
                studentData:[],
                parentData:{}
            }
        },
        watch:{
            value(data){
                if(data){
                    this.getStudentListByExam(this.parentData);
                }
            }
        },
        methods:{
           getStudentListByExam(data){
               getStudentListByExam(data).then(res=>{
                   if(res.data.success){
                       this.studentData = res.data.data;
                       this.loading = false;
                   }
               });
           },
           stopExam(){
               this.$confirm("确定要结束考试吗","友情提示",{type:'warning'}).then(()=>{
                   stop(this.parentData).then(res=>{
                       this.$message({
                           type: res.data.success ? 'success' : 'error',
                           message: res.data.message
                       });
                       this.value = false;
                       this.$parent.getExamList(this.$parent.params);
                   });
               });
           }
        }
    }
</script>
<style scoped>

</style>