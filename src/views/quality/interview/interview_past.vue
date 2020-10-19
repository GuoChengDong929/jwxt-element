<template>
    <div>
        <el-dialog :title="value" :visible.sync="dialogVisible" :fullscreen="true" :center="true">
            <Scroll height="960">
                <el-card shadow="hover">
                    <el-table :data="tableData" v-loading="loading" highlight-current-row stripe>
                        <el-table-column prop="studentName" label="被访谈人"  align="center"></el-table-column>
                        <el-table-column prop="classesName" label="班级名称"  align="center"></el-table-column>
                        <el-table-column prop="createTime" label="访谈时间"  align="center">
                            <template slot-scope="scope">
                                {{format(scope.row.createTime)}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="interviewAddress" label="访谈地点"  align="center"></el-table-column>
                        <el-table-column prop="interviewObjective" label="访谈目的"  align="center"></el-table-column>
                        <el-table-column prop="interviewContent" label="访谈内容"  align="center"></el-table-column>
                        <el-table-column prop="interviewResults" label="访谈结果"  align="center"></el-table-column>
                    </el-table>
                </el-card>
            </Scroll>
        </el-dialog>
    </div>
</template>

<script>

    import { getListByInterview } from "@/api/quality/interview/interview.js"
    import { YearMonthDay } from "../../../utils/tools";

    export default {
        name: "interview_past",
        data(){
            return{
                dialogVisible:false,
                tableData:[],
                value:null,
                enVisible:'0',
                loading:true
            }
        },
        methods:{
            format(date){
                return YearMonthDay(date);
            },
            getListByInterview(){
                getListByInterview().then(res=>{
                    if(res.data.success){
                        this.tableData = res.data.data.interviews;
                        this.enVisible = res.data.data.enVisible;
                        this.loading = false;
                    }else{
                        this.$message.error(res.data.message);
                    }
                })
            },
        },
        created() {
            this.getListByInterview();
        }
    }
</script>

<style scoped>

</style>