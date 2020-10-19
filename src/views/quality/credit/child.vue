<template>
    <div>
        <el-dialog :visible.sync="dialogVisible" :show-close="false">
            <el-row>
                <el-col :span="12" style="padding: 20px">
                    <Scroll height="520">
                        <el-timeline>
                            <el-timeline-item>
                                <el-link @click.native="hide">添加新纪录</el-link>
                            </el-timeline-item>
                            <el-timeline-item v-for="(item,index) in data" :key="index">
                                {{format(item.createTime)}} -- {{item.mark==1 ? '减分' : '加分'}}<br>
                                {{item.mark==1 ? '减分：' : '加分：'}}{{item.fraction}}<br>
                                事由：{{item.incident}}
                            </el-timeline-item>
                        </el-timeline>
                    </Scroll>
                </el-col>
                <el-col :span="12" style="padding: 20px">
                    <el-form :model="formList" label-width="80px" :hidden="isHidden">

                        <el-button type="primary" plain size="mini" style="margin-bottom: 20px">单次分数最高10分，最低1分
                        </el-button>

                        <el-form-item prop="mark" label="学分状态">
                            <el-radio-group v-model="formList.mark">
                                <el-radio label="1">减分</el-radio>
                                <el-radio label="2">加分</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item prop="incident" label="给定事由">
                            <el-input v-model="formList.incident"></el-input>
                        </el-form-item>
                        <el-form-item prop="fraction" label="单次分数">
                            <el-input v-model="formList.fraction" @input="handleInput"></el-input>
                        </el-form-item>
                        <el-button type="primary" plain @click="handleSubmit">提交</el-button>
                    </el-form>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
    import {getCreditList, save} from "../../../api/quality/credit/credit";
    import {formatDateNoWeekNoSeconds} from "../../../utils/tools";

    export default {
        name: "credit-child",
        data() {
            return {
                dialogVisible: false,
                formArray: {},
                data: [],
                formList: {},
                isHidden: true
            }
        },
        methods: {
            format(date) {
                return formatDateNoWeekNoSeconds(date);
            },
            hide() {
                this.isHidden = false;
            },
            handleSubmit() {
                this.formList.studentId = this.formArray.id;
                save(this.formList).then(res => {
                    this.$message({
                        type: res.data.success ? 'success' : 'error',
                        message: res.data.message
                    })
                    this.isHidden = true;
                    this.dialogVisible = false;
                    this.formList = {};
                    this.$parent.handleChange(this.formArray.rows);
                })
            },
            handleInput(val) {
                if (val > 10) {
                    this.formList.fraction = 10;
                } else if (val < 0) {
                    this.formList.fraction = 1;
                } else {
                    this.formList.fraction = val;
                }
            },
            formatDateNoWeekNoSeconds(data) {
                return
            }
        },
        watch: {
            'dialogVisible'(data) {
                if (data == true) {
                    console.log(this.formArray);
                }
                getCreditList({id: this.formArray.id}).then(res => {
                    this.data = res.data.data;
                })
            }
        }
    }
</script>

<style scoped>

</style>
