<template>
	<div>
		<ActionSheet v-model="show1" @close="$emit('close')" title="编辑商品">			
			<div class="info-frame">
				<div class="class-frame">
					<div class="class-item-frame row-start-center">
						<div class="class-item" v-for="(item,key) in classList" :key="key">
							<div class="class-input name">
								<Field v-model="item.name" label="分类名称"/>
							</div>
							<div class="class-input sort">
								<Field v-model="item.sort" label="分类排序" type="number"/>
							</div>
							<Button type="primary" size="small" class="button" @click="updateClass(item.shopid,item._id,item.name,item.sort)">更新分类</Button>
							<Button type="danger" size="small" class="button" @click="delClass(item._id)">删除分类</Button>
						</div>
						<div class="class-item">
							<div class="class-input name">
								<Field v-model="classEdit.name" label="分类名称" placeholder="名称"/>
							</div>
							<div class="class-input sort">
								<Field v-model="classEdit.sort" label="分类排序" type="number" placeholder="排序"/>
							</div>
							<Button type="info" size="small" @click="addClass()" style="width: 100%">新建分类</Button>
						</div>
					</div>
				</div>
				<div class="goods-frame">
					<div class="row-start-center">
						<b class="frame-title">商品信息</b>
						<Button type="info" size="mini" class="add-goods" @click="initGoods();goodsEditting=true">点此新增商品</Button>
					</div>
					<div class="goods-item-frame">
						<div class="goods-item row-start-center">
							<div class="item-frame name">名称</div>
							<div class="item-frame name">图片</div>
							<div class="item-frame stop">缺货</div>
							<div class="item-frame action">操作</div>
						</div>
						<div class="goods-item row-start-center" v-for="(item,key) in goodsList" :key="key">
							<div class="item-frame name">{{item.name}}</div>
							<div class="item-frame pics" style="color: #1989fa;">
								<a @click="showImage(item.pics)">查看</a>
							</div>
							<div class="item-frame stop" :style="{ color: item.stop?'red':'' }">{{item.stop?'是':'否'}}</div>
							<div class="item-frame action row-start-center">
								<Button type="primary" class="action-item" size="mini" @click="goodsEdit=JSON.parse(JSON.stringify(item));goodsEditting=true">编辑</Button>
								<Button type="danger" class="action-item" size="mini" @click="delGoods(item._id)">删除</Button>
								<Button type="danger" class="action-item" size="mini" @click="stopGoods(item._id,!item.stop,key)" v-if="!item.stop">缺货</Button>
								<Button type="primary" class="action-item" size="mini" @click="stopGoods(item._id,!item.stop,key)" v-else>已备货</Button>
							</div>
						</div>
						<Pagination v-model="goodsPage.page" :items-per-page="goodsPage.rows" :total-items="goodsPage.total" @change="getGoods()"/>
					</div>
				</div>
			</div>
		</ActionSheet>
		<ActionSheet v-model="goodsEditting" title="商品信息">
			<div class="goods-info-frame">
				<div class="goods-info-edit">
					<div class="input-frame">
						<div class="img-frame row-start-center">
							<div>商品图片：</div>
							<div class="row-center-center">
								<Upload type="goods" single="addGoodsPics" @getUrl="addGoodsPics">
									<VanImage :src="goodsEdit.pics" fit="cover" width="150" height="110" />
								</Upload>
							</div>
						</div>
					</div>
					<div class="input-frame">
						<Field v-model="goodsEdit.name" placeholder="填写商品名称，如小炒肉、可乐"/>
					</div>
					<div class="input-frame">
						<Field v-model="goodsEdit.code" placeholder="填写商品代码，如A13、C20"/>
					</div>
					<div class="input-frame">
						<Field v-model="goodsEdit.price" type="number" placeholder="填写商品价格，货币为商家默认货币"/>
					</div>
					<div class="input-frame">
						<Field v-model="goodsEdit.count" type="number" placeholder="填写商品数量，价格单位数量"/>
					</div>
					<div class="input-frame">
		    			<RadioGroup v-model="goodsEdit.unit">
		    				<div class="row-start-top radio-type">
		    					<p>物品单位：</p>	
		    					<span v-for="(item,key) in UNIT" :key="key" style="margin-right: 10px;margin-bottom: 20px">
				    				<Radio :name="key">{{ item }}</Radio>
				    			</span>
			    			</div>
		    			</RadioGroup>
			    	</div>
					<div class="input-frame">
						<CheckboxGroup v-model="goodsEdit.classid">
							<div class="row-start-top checkbox-type">
								<div>商品分类：</div>
								<span v-for="(item,key) in classList" :key="key" style="margin-right: 10px;margin-bottom: 20px">
									<Checkbox :name="item._id" shape="square">{{ item.name }}</Checkbox>
								</span>
							</div>
						</CheckboxGroup>
					</div>
					<div class="input-frame">
						<div class="row-start-center">
							<div style="width: 40%">
								<Field v-model="goodsTag" placeholder="商品标签，如新品、推荐、火爆等"/>
							</div>
							<Button type="info" size="mini" @click="addGoodsTag()">添加标签</Button>
							<div class="tags-frame row-start-center">
								<Tag class="goods-tag" closeable size="medium" @close="delGoodsTag(key)" type="success" v-for="(item,key) in goodsEdit.tags" :key="key">
									{{ item }}
								</Tag>
							</div>
						</div>
					</div>
					<div class="input-frame">
						<Field v-model="goodsEdit.sort" type="number" placeholder="填写商品排序，数值越高越靠前，默认为 0"/>
					</div>
					<div class="goods-action">
						<Button type="info" v-if="!goodsEdit._id" @click="addGoods()">添加商品</Button>
						<Button type="info" v-else @click="updateGoods()">更新商品</Button>
					</div>
				</div>
			</div>
		</ActionSheet>
	</div>
</template>
<script>
	import { Image as VanImage, Field, Button, Notify, Radio, RadioGroup, Checkbox, CheckboxGroup, Icon, Dialog, Tag, ImagePreview, Pagination, ActionSheet } from 'vant'
	import { UNIT } from '_config/shop'
	import Upload from '_common/BASE/Upload'
	import API from '_api'
	export default {
		name: 'EditGoods',
		components:{ VanImage, Field, Button, Notify, Radio, RadioGroup, Checkbox, CheckboxGroup, Icon, Upload, RadioGroup, Radio, Tag, Pagination, ActionSheet },
		props:['shopId','currency'],
		data(){
			return {
				UNIT,
				show1: true,
				show2: false,
				classList: [],
				goodsList: [],
				classEdit: {
					name: '',
					sort: ''
				},
				goodsEdit: {
					classid: [],
					code: '',
					name: '',
					pics: '',
					price: '',
					count: '',
					unit: 0,
					tags: [],
					sort: ''
				},
				goodsPage:{
					page: 1,
					rows: 50,
					total: 0
				},
				goodsTag: '',
				goodsEditting: false
			}
		},
		computed:{
			classobj(){

				let obj = {}

				for (var i = this.classList.length - 1; i >= 0; i--) {
					
					obj[this.classList[i]._id] = this.classList[i].name
				}

				return obj
			}
		},
		async mounted(){

			await this.getClass()

			await this.getGoods()
		},
		methods:{
			async getClass(){

				const { data } = await API.shop.getClass(this.shopId)

				if (!data.success) {
				
					return Notify({ type: 'danger', message: data.message })
				}

				this.classList = data.data

			},
			async addClass(){

				if (!this.classEdit.name.trim()) {

					return Notify({ type: 'danger', message: '分类名称不得为空' })
				}

				const name = this.classEdit.name.trim()

				const sort = this.classEdit.sort? this.classEdit.sort: 0

				const { data } = await API.shop.addClass(this.shopId,name,sort)

				if (!data.success) {
				
					return Notify({ type: 'danger', message: data.message })
				}

				await this.getClass()

				this.classEdit.name = this.classEdit.sort = ''

				Notify({ type: 'success', message: '添加成功' })
			},
			async delClass(_id){

				Dialog.confirm({ title: '删除分类', message: '确认删除商品分类么？' }).then(async () => {

					const { data } = await API.shop.delClass(this.shopId,_id)

					if (!data.success) {
					
						return Notify({ type: 'danger', message: data.message })
					}

					await this.getClass()

					Notify({ type: 'success', message: '删除成功' })

			  	}).catch(()=>{

			  	})
			},
			async updateClass(shopid, _id ,name, sort){

				Dialog.confirm({ title: '更新分类信息', message: '确认更新分类信息么？' }).then(async () => {

					if (!name.trim()) {

						return Notify({ type: 'danger', message: '分类名称不得为空' })
					}

					const { data } = await API.shop.updateClass(shopid,_id,name,sort)

					if (!data.success) {
					
						return Notify({ type: 'danger', message: data.message })
					}

					await this.getClass()

					Notify({ type: 'success', message: '更新成功' })

				}).catch(()=>{

			  	})
			},
			async addGoodsPics(url){

				this.goodsEdit.pics = url
			},
			async addGoodsTag(){

				if (!this.goodsTag.trim()) {

					return Notify({ type: 'danger', message: '商品标签不得为空' })
				}

				if (this.goodsTag.length>5) {

					return Notify({ type: 'danger', message: '标签不得大于5个字' })
				}

				if (this.goodsEdit.tags.length>=3) {

					return Notify({ type: 'danger', message: '商品标签不得超过三个' })
				}

				this.goodsEdit.tags.push(this.goodsTag)

				this.goodsTag = ''
			},
			async delGoodsTag(key){
				
				this.goodsEdit.tags.splice(key,1)
			},
			async initGoods(){

				this.goodsEdit = { classid: [], code: '', name: '', pics: '', price: '', count: '', unit: 0, tags: [], sort: '' }
			},
			async getGoods(){

				const { data } = await API.shop.getGoods(this.shopId,this.goodsPage.page,this.goodsPage.rows)

				if (!data.success) {
				
					return Notify({ type: 'danger', message: data.message })
				}

				this.goodsList = data.data.items

				this.goodsPage.total = data.data.total

			},
			async addGoods(){

				if (!this.goodsEdit.name.trim()) {

					return Notify({ type: 'danger', message: '商品名称不得为空' })
				}

				if (!this.goodsEdit.code.trim()) {

					return Notify({ type: 'danger', message: '商品代码不得为空' })
				}

				if (!this.goodsEdit.classid.length) {

					return Notify({ type: 'danger', message: '商品分类至少一个' })
				}

				if (!this.goodsEdit.price.trim()) {

					return Notify({ type: 'danger', message: '商品价格不得为空' })
				}

				if (!this.goodsEdit.count.trim()) {

					return Notify({ type: 'danger', message: '商品计价数量不得为空' })
				}

				if (!String(this.goodsEdit.unit).trim()) {

					return Notify({ type: 'danger', message: '商品计价单位不得为空' })
				}

				if (!this.goodsEdit.pics.trim()) {

					this.goodsEdit.pics = '/img/no-img.png'
				}

				this.goodsEdit.sort = this.goodsEdit.sort.trim()?this.goodsEdit.sort:0

				const params = { shopid: this.shopId, ...this.goodsEdit }

				const { data } = await API.shop.addGoods(params)

				if (!data.success) {
				
					return Notify({ type: 'danger', message: data.message })
				}

				await this.getGoods()

				this.goodsEditting = false

			},
			async delGoods(_id){

				Dialog.confirm({ title: '删除商品', message: '确认删除商品么？' }).then(async () => {

					const { data } = await API.shop.delGoods(this.shopId,_id)
				
					if (!data.success) {
					
						return Notify({ type: 'danger', message: data.message })
					}

					await this.getGoods()

					Notify({ type: 'success', message: '删除成功' })

			  	}).catch(()=>{

			  	})
			},
			async updateGoods(){

				if (!this.goodsEdit.name.trim()) {

					return Notify({ type: 'danger', message: '商品名称不得为空' })
				}

				if (!this.goodsEdit.code.trim()) {

					return Notify({ type: 'danger', message: '商品代码不得为空' })
				}

				if (!this.goodsEdit.classid.length) {

					return Notify({ type: 'danger', message: '商品分类至少一个' })
				}

				if (!this.goodsEdit.price.trim()) {

					return Notify({ type: 'danger', message: '商品价格不得为空' })
				}

				if (!this.goodsEdit.count.trim()) {

					return Notify({ type: 'danger', message: '商品计价数量不得为空' })
				}

				if (!String(this.goodsEdit.unit).trim()) {

					return Notify({ type: 'danger', message: '商品计价单位不得为空' })
				}

				if (!this.goodsEdit.pics.trim()) {

					this.goodsEdit.pics = '/img/no-img.png'
				}

				this.goodsEdit.sort = this.goodsEdit.sort.trim()?this.goodsEdit.sort:0

				const { data } = await API.shop.updateGoods(this.goodsEdit)

				if (!data.success) {
				
					return Notify({ type: 'danger', message: data.message })
				}

				await this.getGoods()

				this.goodsEditting = false
			},
			async stopGoods(_id, stop, key){

				const { data } = await API.shop.stopGoods(this.shopId, _id, stop)

				if (!data.success) {
				
					return Notify({ type: 'danger', message: data.message })
				}

				this.goodsList[key].stop = stop
			},
			async showImage(url){

				ImagePreview({ images: [url], closeable: true });
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import "~/css/variable.scss"; 
    .info-frame{
    	width: 100%;
    	height: 500px;
    	overflow: auto;
	    background-color: #ffffff;
	    text-align: left;
	    padding: 5px;
	    font-size: 14px;
	    padding-bottom: 100px;
	}
	.class-frame{
		margin-top: 20px;
		.class-item-frame{
			flex-wrap: wrap;
			.class-item{
				width: 50%;
				border: 1px solid #f7f7f7;
				.class-input{
					border-bottom: 1px solid #f7f7f7;
				}
				.button{
					width: 50%;
				}
			}
		}
		.class-item-edit{
			width: 100%;
			margin-top: 20px;
			.class-input{
				border: 1px solid #f7f7f7;
			}
			.name{
				width: 50%;
			}
			.sort{
				width: 40%;
			}
			.button{
				width: 10%;
			}
		}
	}
	.goods-frame{
		margin-top: 20px;
		.add-goods{
			margin-left: 20px;
		}
		.goods-item-frame{
			.item-frame{
				border-right: 1px solid #f7f7f7;
			}
			.goods-item{
				height: 40px;
				line-height: 40px;
				text-align: center;
				border: 1px solid #f7f7f7;
				.name{
					width: 30%;
				}
				.pics{
					width: 15%;
				}
				.stop{
					width: 15%;
				}
				.action{
					width: 40%;
					.action-item{
						margin-left: 5px;
					}
				}
			}
		}
	}
	.frame-title{
		font-size: 16px;
	}
	.goods-info-frame{
		width: 100%;
    	height: 500px;
    	overflow: auto;
    	background-color: #ffffff;
    	text-align: left;
	    padding: 5px;
	    font-size: 14px;
	    padding-bottom: 100px;
	    .goods-info-edit{
	    	margin-top: 20px;
	    }
	    .input-frame{
	    	border-bottom: 1px solid #f7f7f7;
	    }
	    .checkbox-type,.radio-type{
	    	padding: 10px 16px;
	    	@extend .flex-wrap;

	    }
	    .img-frame{
	    	padding: 10px 16px;
	    }
	    .goods-action{
	    	margin-top: 20px;
	    }
	    .tags-frame{
	    	min-height: 40px;
	    	.goods-tag{
	    		margin-left: 20px;
	    	}
	    }
	}
</style>