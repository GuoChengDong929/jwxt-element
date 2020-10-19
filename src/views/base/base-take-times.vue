<template>
    <div>
        <el-card style="height: 800px;width: 500px;text-align: center;margin: 10px 0px 0px 550px">
            <div slot="header" style="height: 70px;">
				<p><strong style="font-size: 30px;">张三的购物车</strong></p>
				<el-button  v-if="goods.length == 0" type="danger" size="small" @click="initGoods" style="margin-bottom: 15px;">初始化测试数据</el-button>
			</div>
			
			<el-card :key="item.name" v-for="item in goods" style="margin-bottom: 5px;">
				<el-row>
					<el-col :span="8">
						<el-image style="width: 100px; height: 100px" :src="item.url"></el-image>
					</el-col>
					<el-col :span="16">
						<el-row>
							<el-col :span="24"><strong>{{item.name}}</strong></el-col>
							<el-col :span="24">
								<el-row>
									<el-col :span="12"> <h3 style="color: red;float: left;">￥ {{item.price}}</h3> </el-col>
									<el-col :span="12">
										<el-input-number @blur="(currentValue, oldValue)=>{numberChange(currentValue, oldValue,item.good_id)}" @change="(currentValue, oldValue)=>{numberChange(currentValue, oldValue,item.good_id)}" style="float: right  ; margin-top: 20px ;" v-model="item.number" :min="0" :max="5" label="购买数量"></el-input-number>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</el-col>
				</el-row>
			</el-card>
			
			<el-card style="margin-top: 0px; padding-bottom: 0px; height: 50px;font-size: 25px;" shadow="never" body-style="{border:'0px'solid gray }">
				<el-row >
					<el-col :span="4">
							<span style="margin-bottom: 20px;" class="el-icon-s-home" @click="handleClick('1')"></span>
					</el-col>
					<el-col :span="5"><span class="el-icon-menu" ></span></el-col>
					<el-col :span="5"><span class="el-icon-search" ></span></el-col>
					<el-col :span="5">
						<el-badge :value="goodTotal" class="item" :hidden="goodTotal == 0 ? true:false">
							<span class="el-icon-shopping-cart-full" ></span>
						</el-badge>
					</el-col>
					<el-col :span="5"><span class="el-icon-user" ></span></el-col>
				</el-row>
			</el-card>
			
        </el-card>
    </div>
</template>

<script>
	
	import {initData,findAllOrders,changeOrderTotal} from "../../api/redis-test.js"
	
    export default {
        name: "base-take-times",
		data(){
			return {
				goods:[],
				radioChange:'0',
				goodTotal:0
			}
		},
		watch:{
		 	goods(data){
				if(data.length != 0){
					let sum = 0;
					data.forEach(item=>{
						sum += item.number;
					});
					this.goodTotal = sum;
				}
			},
		},
		methods:{
			initGoods(){
				initData();
				setTimeout(()=>{
					findAllOrders().then(res=>{
						this.goods = res.data;
					})
				},3000);
			},
			numberChange(currentValue, oldValue,good_id){
				
				let total = currentValue - oldValue;
				changeOrderTotal({value:total,goodId:good_id}).then(res=>{
					this.goodTotal = res.data;
					setTimeout(()=>{
						findAllOrders().then(res=>{
							this.goods = res.data;
						})
					},1000);
				})
			}
		},
		created() {
			findAllOrders().then(res=>{
				this.goods = res.data;
			})
		}
    }
</script>

<style scoped>
.el-card {
    border: 0px solid #EBEEF5!important;
}
</style>