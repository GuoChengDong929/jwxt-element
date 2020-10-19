<template>
    <div style="padding: 20px">
        <el-select v-model="classesId" @change="handleChange">
            <el-option v-for="item in classesList" :value="item.id" :label="item.classesName"
                       :key="item.id" placeholder="请选择班级"></el-option>
        </el-select>

        <el-button type="info" plain style="float: right" icon="el-icon-pear">
            <span style="color: blue">低于80分，回家反省!&nbsp;&nbsp;&nbsp;</span>
            <span style="color: orange">低于75分，签订不安置就业协议!&nbsp;&nbsp;&nbsp;</span>
            <span style="color: red">低于70分，准备开除!</span>
        </el-button>

        <el-table :data="data" :hidden="isHidden" style="margin-top: 20px">
            <el-table-column type="index" align="center" label="序号"></el-table-column>
            <el-table-column prop="nickName" label="姓名" align="center">
                <template slot-scope="scope">
                    <el-link type="danger" @click.native="openDialog('creditChild',scope.row)">{{scope.row.nickName}}
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column label="学分" align="center">
                <el-table-column prop="creditPlus" label="加分项" align="center">
                    <template slot-scope="scope">
                        {{scope.row.creditPlus ? scope.row.creditPlus : scope.row.creditPlus = 0}}
                    </template>
                </el-table-column>
                <el-table-column prop="creditLess" label="减分项" align="center">
                    <template slot-scope="scope">
                        {{scope.row.creditLess ? scope.row.creditLess : scope.row.creditLess = 0}}
                    </template>
                </el-table-column>
                <el-table-column prop="creditTotal" label="总学分" align="center">
                    <template slot-scope="scope">
                        {{scope.row.creditTotal ? scope.row.creditTotal : scope.row.creditTotal = 100}}
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="预警" align="center">
                <template slot-scope="scope">
                    {{scope.row.creditTotal >= 80 ? '未达到预警' : (scope.row.creditTotal<80 && scope.row.creditTotal>=75 ?
                    '回家反省' : (scope.row.creditTotal<75 && scope.row.creditTotal>=70) ? '签订不安置就业协议' : '准备开除')}}
                </template>
            </el-table-column>
        </el-table>

        <credit-child ref="creditChild"></credit-child>
    </div>
</template>

<script>
    import {getClassesName} from "../../../api/quality/credit/credit";
    import {getStudentList} from "../../../api/quality/interview/interview";

    export default {
        name: "credit-index",
        data() {
            return {
                classesList: [],
                classesId: '',
                data: [],
                isHidden: true,
                rows: ''
            }
        },
        components: {
            CreditChild: () => import("@/views/quality/credit/child.vue")
        },
        methods: {
            getClasses() {
                getClassesName().then(res => {
                    this.classesList = res.data.data;
                })
            },
            handleChange(val) {
                console.log("val", val);
                this.rows = val;
                getStudentList({id: val}).then(res => {
                    this.data = res.data.data;
                    this.isHidden = false;
                })
            },
            openDialog(name, data) {
                data.rows = this.rows;
                this.$refs[name].formArray = data;
                this.$refs[name].dialogVisible = true;
            }
        },
        created() {
            this.getClasses();
        }
    }
</script>

<style scoped>

</style>
