<template>
    <div>
        <el-card align="left">
            <el-button type="primary" plain>增加</el-button>
            <el-button type="success" plain>修改</el-button>
        </el-card>
        <el-card shadow="hover">
            <el-table :data="tableData" @row-click="rowClickOne" v-loading="loading" stripe border fit highlight-current-row>
                <el-table-column prop="id" label="序号" align="center"></el-table-column>
                <el-table-column prop="deviceName" label="设备名称" align="center"></el-table-column>
                <el-table-column prop="deviceType" label="设备型号" align="center"></el-table-column>
                <el-table-column prop="deviceNum" label="设备数量" align="center"></el-table-column>
                <el-table-column prop="devicePrice" label ="设备价格（万元）" align="center"></el-table-column>
                <el-table-column prop="deviceTotal" label ="设备总额" align="center"></el-table-column>
                <el-table-column prop="supplier" label="供应方" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="danger" plain @click="remove(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="params.page"
                :page-size="params.size"
                :total="params.total"
                align="center">
        </el-pagination>
        <add-device ref="addDevice"></add-device>
    </div>
</template>

<script>

    import { getListByDevice,deleteDevice } from "../../api/demo/device";

    export default {
        name: "device",
        components:{
          AddDevice:import("@/views/demo/child/add_device.vue"),
        },
        data(){
            return{
                tableData: [],
                loading:true,
                params:{
                    page:1,
                    size:5,
                    total:0
                },
                rowValue:{},
            }
        },
        methods:{
            remove(data){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteDevice(data).then(res => {
                        if (res.data.code == 10000) {
                            this.$message({message: '成功', type: 'success'});
                        } else {
                            this.$message.error("失败");
                        }
                        this.getListByDevice(this.params);
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            getListByDevice(){
                getListByDevice(this.params).then(res=>{
                    this.tableData = res.data.data.rows;
                    this.params.total = res.data.data.total;
                    this.loading=false;
                })
            },
            handleSizeChange(val) {

            },
            handleCurrentChange(val) {
                this.params.page = val;
                this.getListByDevice(this.params);
            }
        },
        created() {
            this.getListByDevice(this.params);
        }
    }
</script>

<style scoped>

</style>