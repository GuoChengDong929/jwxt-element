<template>
    <div>
        <el-card>
            <el-button type="primary"><i class="el-icon-circle-plus-outline" style="margin-right: 2px;float: left"></i>新增</el-button>
        </el-card>
        <el-card shadow="never">
            <el-table :data="standardData" stripe border fit highlight-current-row>
                <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
                <el-table-column label="标准名称" prop="name" width="150px" align="center"></el-table-column>
                <el-table-column label="最大重量" prop="maxWeight" width="150px" align="center"></el-table-column>
                <el-table-column label="最小重量" prop="minWeight" width="150px" align="center"></el-table-column>
                <el-table-column label="最大长度" prop="maxLength" width="150px" align="center"></el-table-column>
                <el-table-column label="最小长度" prop="minLength" width="150px" align="center"></el-table-column>
                <el-table-column label="执行时间" prop="operatingTime" align="center" :formatter="formatterTime"></el-table-column>
                <el-table-column label="执行单位" prop="operatingCompany" width="150px" align="center"></el-table-column>
                <el-table-column label="执行人" prop="operator" width="150px" align="center"></el-table-column>
                <el-table-column label="启禁状态" prop="status" width="150px" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == '1'"><el-tag effect="plain" size="small" type="success">启用</el-tag></span>
                        <span  v-if="scope.row.status == '2'"><el-tag effect="plain" size="small" type="warning">禁用</el-tag></span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button style="margin-right: 5px" size="mini"> <i class="el-icon-scissors" style="margin-right: 2px"></i>编辑</el-button>
                        <el-button style="margin-right: 5px" type="danger" size="mini"> <i class="el-icon-connection" style="margin-right: 2px"></i>启禁</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>

    import { formatDate } from "@/utils/tools";

    export default {
        name: "base-standard",
        data(){
            return {
                standardData:[]
            }
        },
        methods:{
            formatterTime(row,columns,cellValue,index){
                return formatDate(cellValue);
            }
        },
        created() {
            let arr = [
                {name:'1公斤',maxLength:2,minLength:1,maxWeight:2,minWeight:1,operator:"张三",operatingCompany:"收派一部",operatingTime:new Date().getTime(),status:'1'},
                {name:'5公斤',maxLength:5,minLength:3,maxWeight:5,minWeight:3,operator:"张三",operatingCompany:"收派一部",operatingTime:new Date().getTime(),status:'2'},
                {name:'10公斤',maxLength:10,minLength:6,maxWeight:10,minWeight:6,operator:"张三",operatingCompany:"收派一部",operatingTime:new Date().getTime(),status:'1'},
                {name:'20公斤',maxLength:20,minLength:11,maxWeight:20,minWeight:11,operator:"张三",operatingCompany:"收派一部",operatingTime:new Date().getTime(),status:'1'},
                {name:'50公斤',maxLength:50,minLength:21,maxWeight:50,minWeight:21,operator:"张三",operatingCompany:"收派一部",operatingTime:new Date().getTime(),status:'1'},
            ];
           this.standardData = arr;
        }
    }
</script>

<style scoped>

</style>