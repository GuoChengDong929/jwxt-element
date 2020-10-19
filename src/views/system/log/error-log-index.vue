<template>
    <div style="height: 85vh">
        <div style="height: 7vh;margin: 20px 5px 10px 5px;padding: 5px">
            <el-input type="text" placeholder="请输入操作人" v-model="params.modifyUser" style="width: 250px;margin-right: 10px"></el-input>
            <el-input type="text" placeholder="请输入错误描述文本" v-model="params.operation" style="width: 250px;margin-right: 10px"></el-input>
            <el-button type="success" plain @click="params={page:1,size:10,total:0,modifyUser:'',operation:''},getErrorLogList(params)"><i style="margin-right: 5px" class="el-icon-refresh"></i>重置</el-button>
        </div>
        <div style="height: 78vh">
            <el-table style="margin: 10px" :data="data" :loading="loading">
                <el-table-column type="index" align="center" label="序号" width="80px"></el-table-column>
                <el-table-column label="操作相关" align="center">
                    <el-table-column prop="modifyUser" label="操作人" align="center"></el-table-column>
                    <el-table-column prop="ip" label="操作人IP地址" align="center"></el-table-column>
                </el-table-column>

                <el-table-column label="错误相关" align="center">
                    <el-table-column prop="operation" label="错误描述文本" align="center"></el-table-column>
                    <el-table-column prop="method" label="错误所在方法" show-overflow-tooltip align="center"></el-table-column>
                    <el-table-column prop="params" label="请求参数" show-overflow-tooltip align="center"></el-table-column>
                    <el-table-column prop="message" label="错误信息" show-overflow-tooltip align="center"></el-table-column>
                    <el-table-column prop="errorType" label="错误类型" show-overflow-tooltip align="center"></el-table-column>
                </el-table-column>

                <el-table-column prop="createTime" label="操作时间" align="center">
                    <template slot-scope="scope">
                        {{formatDate(scope.row.createTime)}}
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination background
                           layout="prev,pager,next"
                           :total="params.total"
                           :page-size="params.size"
                           :current-page="params.page"
                           :hide-on-single-page="false"
                           @size-change="handleSizeChange"
                           @current-change="handlePageChange"></el-pagination>
        </div>
    </div>
</template>

<script>

    import { formatDateNoWeek } from "@/utils/tools";

    import { getErrorLogList } from "@/api/log/error-log";

    export default {
        name: "error-log-index",
        data(){
            return {
                loading:true,
                data:[],
                params:{page:1,size:10,total:0,modifyUser:'',operation:''}
            }
        },
        watch:{
            'params.modifyUser'(data){
                if(data){
                    this.getErrorLogList(this.params);
                }
            },
            'params.operation'(data){
                if(data){
                    this.getErrorLogList(this.params);
                }
            }
        },
        methods:{
            formatDate(date){
                return formatDateNoWeek(date);
            },
            handleSizeChange(val){
                this.params.size = val;
                this.getErrorLogList(this.params);
            },
            handlePageChange(val){
                this.params.page = val;
                this.getErrorLogList(this.params);
            },
            getErrorLogList(data){
                getErrorLogList(data).then(res=>{
                    if(res.data.success){
                        this.data = res.data.data.rows;
                        this.params.total = res.data.data.total;
                        this.loading = false;
                    }
                });
            }
        },
        created() {
            this.getErrorLogList(this.params);
        }
    }
</script>

<style scoped>

</style>