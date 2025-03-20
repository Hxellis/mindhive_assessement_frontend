<template>
	<div class="flex flex-col bg-neutral-900 p-5 h-screen w-screen overflow-hidden">
		<!-- Header -->
		<!-- <header class="text-3xl mb-5 text-white">Find KL Subway Branches</header> -->


		<div class="flex flex-1 min-h-0 gap-5 overflow-hidden">
			<!-- Map Section -->
			<div class="w-full rounded-xl overflow-hidden h-full">
				<GoogleMap
					:api-key="mapsKey"
					class="h-full w-full"
					:center="center"
					:zoom="zoom"
				>
					<Circle
						v-if="show5km"
						:options="{
							center: center,
							radius: 5000,
							strokeColor: '#FF0000',
							strokeOpacity: 0.8,
							strokeWeight: 2,
							fillColor: '#FFAAAA',
							fillOpacity: 0.2,
						}"
					/>

					<CustomMarker
						v-for="subway in filteredSubwayList"
						:key="subway.id"
						:options="{ position: { lat: subway.latitude, lng: subway.longtitude }, anchorPoint: 'BOTTOM_CENTER' }"
					>
						<img
							src="/src/assets/images/bread.png"
							width="40"
							height="40"
							class="transform -translate-y-1/2"
						/>
					</CustomMarker>		
				</GoogleMap>
			</div>

			<!-- Sidebar or Additional Section -->
			<div class="w-1/2 text-black p-2 rounded-xl overflow-hidden flex flex-col">
				<!-- Fixed Button Section -->

				<Tabs class="">
					<Tab name="Filters" class="space-x-2">
						<input
							v-model="searchQuery"
							type="text"
							placeholder="Search by branch name..."
							class="w-full px-3 py-2 mb-3 text-sm rounded bg-stone-800 text-white placeholder-stone-400 focus:outline-none"
						/>

						<button
							:class="[ 'border rounded px-2 py-1 transition-colors duration-200', show5km ? 'bg-stone-400 text-white border-stone-300' : 'text-stone-200 border-stone-200 hover:bg-stone-800']"
							@click="() => {
								if (!show5km) {
									setMapPoint(center, 13) 
								}
								show5km = !show5km
							}"
						>
							Withtin 5KM
						</button>

						<button
							class="border rounded px-2 py-1 transition-colors duration-200 text-stone-200 border-stone-200 hover:bg-stone-800"
							@click="() => resetView()"
						>
							Reset View / Filter
						</button>
					</Tab>

					<Tab name="Chatbot">
						<div class="flex flex-col h-full">
							<!-- Chatbot Output Section -->
                            <div class="flex-1 mb-4 p-3 rounded bg-stone-800 text-white overflow-auto max-h-[33vh]">
                                <div v-if="loading" class="italic text-stone-400 animate-pulse">
                                    Generating response, this may take some time...
                                </div>
                                <div v-else-if="chatbotResponse" class="whitespace-pre-wrap">
                                    {{ chatbotResponse }}
                                </div>
                                <div v-else class="text-stone-500">
                                    Ask me something about KL Subway branches
                                </div>
                            </div>

							<!-- Input + Send Button -->
							<div class="flex gap-2">
								<input
									v-model="chatInput"
									type="text"
                                    :disabled="loading"
									placeholder="Type your question..."
									class="flex-1 px-3 py-2 text-sm rounded bg-stone-800 text-white placeholder-stone-400 focus:outline-none"
									@keydown.enter="sendChatbotMessage"
								/>
								<button
									class="px-4 py-2 rounded bg-stone-600 text-white hover:bg-stone-500 disabled:bg-stone-700"
									@click="sendChatbotMessage"
									:disabled="loading || !chatInput.trim()"
								>
									Send
								</button>
							</div>
						</div>
					</Tab>
				</Tabs>
				<div class="my-2 space-x-2">

				</div>

				<!-- Scrollable List Section -->
				<div class="flex-1 overflow-y-auto space-y-2 pr-1">
					<SubwayBranchInfo
						v-for="subwayBranch in filteredSubwayList"
						:key="subwayBranch.id"
						:branchData="subwayBranch"
						:selected="selectedSubway == subwayBranch.id"
						@showBranch="(pos) => { selectedSubway = subwayBranch.id; setMapPoint(pos, show5km ? 13 : 16)}"
						@clearBranch="resetView"
					/>
				</div>
			</div>
		</div>
	</div>
</template>


<script setup>
	import { onMounted, ref, computed, toRaw } from 'vue';
	import { GoogleMap, CustomMarker, Circle } from 'vue3-google-map'
	import {Tabs, Tab} from 'vue3-tabs-component';

	const apiUrl = import.meta.env.VITE_API_URL
	const mapsKey = import.meta.env.VITE_MAPS_API_KEY

	const subwayList = ref([])

	// Map data
	const userLocation = ref({ lat: 0, lng: 0 })
	const center = ref({ lat: 0, lng: 0 })
	const zoom = ref(12)

	// Filters
	const show5km = ref(false);
	const searchQuery = ref('');

	// Chatbot
	const chatInput = ref('');
	const chatbotResponse = ref('');
	const loading = ref(false);
	const chatbotReturnedList = ref([])

	const selectedSubway = ref()

	function setMapPoint(pos, zoomVal=12) {
		center.value = pos
		zoom.value = zoomVal
	}

	const filteredSubwayList = computed(() => {
		if (chatbotReturnedList.value.length) {
			return chatbotReturnedList.value
		}

		let list = [...subwayList.value];

		// 5KM
		if (show5km.value && center.value.lat !== 0 && center.value.lng !== 0) {
			list = list.filter(branch => isWithinRadius(branch, center.value, 5000));
		}

		// Search
		if (searchQuery.value.trim() !== '') {
			const query = searchQuery.value.toLowerCase();
			list = list.filter(branch => branch.name.toLowerCase().includes(query));
		}

		return list;
	});

	function resetView() {
		show5km.value = false;
		searchQuery.value = '';
		selectedSubway.value = null
		center.value = userLocation.value;
		chatbotReturnedList.value = []
		zoom.value = 12;
	}

	function isWithinRadius(branch, center, radiusMeters) {
		const toRad = deg => deg * Math.PI / 180;
		const R = 6371000; // Earth radius in meters
		const dLat = toRad(branch.latitude - center.lat);
		const dLng = toRad(branch.longtitude - center.lng);
		const a = Math.sin(dLat / 2) ** 2 +
			Math.cos(toRad(center.lat)) *
			Math.cos(toRad(branch.latitude)) *
			Math.sin(dLng / 2) ** 2;
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c <= radiusMeters;
	}

	async function sendChatbotMessage() {
		if (!chatInput.value.trim()) return;
		loading.value = true;
		chatbotResponse.value = '';

		const compressedSubwayList = filteredSubwayList.value.map((branch) => {
			return toRaw({
				name: branch.name,
				address: branch.address,
				operating_hours: branch.operating_hours,
			})
		})

		try {
			const response = await fetch(`${apiUrl}/chatbotSendMsg`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
					center: toRaw(center.value),
					question: chatInput.value,
					branches: compressedSubwayList
				})
			});
			const data = await response.json();
			chatbotResponse.value = data.reply;
			if (data.status == 'success') {
				chatbotResponse.value = data.gemmaReply.reply
				chatbotReturnedList.value = data.gemmaReply.newOrder.map((returnedBranch) => {
					return subwayList.value.find(original => original.name === returnedBranch.name && original.address === returnedBranch.address)
				}).filter(Boolean);
			}

		} catch (err) {
			console.error("Error:", err);
			chatbotResponse.value = "Oops! Something went wrong. Please try again.";
		} finally {
			loading.value = false;
			chatInput.value = '';
		}
	}

	onMounted(() => {

		navigator.geolocation.getCurrentPosition(
			(pos) => {
				userLocation.value = ({ lat: pos.coords.latitude, lng: pos.coords.longitude })
				setMapPoint({ lat: pos.coords.latitude, lng: pos.coords.longitude })
				console.log(pos.coords.latitude, pos.coords.longitude)
			},
			(err) => {
				console.error("Geolocation error:", err)
			}
		)

		fetch(`${apiUrl}/getAllKLSubway`, {
			method: "GET"
		})
		.then((res) => res.json())
		.then((data) => {
			console.log(data)
			if (data.length) {
				subwayList.value = data
			}
		})
		.catch((err) => {
			console.log("error", err)
		})
	})

</script>
