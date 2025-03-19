<template>
	<div class="flex flex-col bg-neutral-900 p-5 h-screen w-screen overflow-hidden">
		<!-- Header -->
		<header class="text-3xl mb-5 text-white">Find KL Subway Branches</header>

		<!-- Main Content -->
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
						:options="{
							center: userLocation,
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
				<div class="my-2 space-x-2">
					<button
						:class="[
							'border rounded px-2 py-1 transition-colors duration-200',
							showNearbyOnly ? 'bg-stone-800 text-white border-stone-300' : 'text-stone-200 border-stone-200 hover:bg-stone-800'
						]"
						@click="showNearbyOnly = true"
					>
						Nearby Only
					</button>

					<button
						:class="[
							'border rounded px-2 py-1 transition-colors duration-200',
							!showNearbyOnly ? 'bg-stone-800 text-white border-stone-300' : 'text-stone-200 border-stone-200 hover:bg-stone-800'
						]"
						@click="showNearbyOnly = false"
					>
						Reset View
					</button>
				</div>

				<!-- Scrollable List Section -->
				<div class="flex-1 overflow-y-auto space-y-2 pr-1">
					<SubwayBranchInfo
						v-for="subwayBranch in filteredSubwayList"
						:key="subwayBranch.id"
						:branchData="subwayBranch"
						@showBranch="(pos) => setMapPoint(pos, 18)"
					/>
				</div>
			</div>
		</div>
	</div>
</template>


<script setup>
	import { onMounted, ref, computed } from 'vue';
	import { GoogleMap, Marker, CustomMarker, Circle } from 'vue3-google-map'

	const apiUrl = import.meta.env.VITE_API_URL
	const mapsKey = import.meta.env.VITE_MAPS_API_KEY

	const subwayList = ref([])
	const userLocation = ref({ lat: 0, lng: 0 })

	const center = ref({ lat: 0, lng: 0 })
	const zoom = ref(13)
	// const filteredSubwayList = ref([])

	const showNearbyOnly = ref(false);
	


	function setMapPoint(pos, zoomVal=13) {
		center.value = pos
		zoom.value = zoomVal
	}

	const filteredSubwayList = computed(() => {
		return showNearbyOnly.value ? subwayList.value.filter(branch => isWithinRadius(branch, userLocation.value, 5000)) : subwayList.value;
	});

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

		// fetch(`${apiUrl}/getAllKLSubway`, {
		// 	method: "GET"
		// })
		// .then((res) => res.json())
		// .then((data) => {
		// 	console.log(data)
		// if (data.length) {
		// 	subwayList.value = data
		// }
		// })
		// .catch((err) => {
		// 	console.log("error", err)
		// })
	})

	subwayList.value = [
	{
		"id": 1,
		"name": "Subway Menara UOA Bangsar",
		"address": "Jalan Bangsar Utama 1, Unit 1-2-G, Menara UOA Bangsar, Kuala Lumpur, 59000",
		"operating_hours": "Monday - Sunday, 8:00 AM - 8:00 PM",
		"latitude": 3.128099,
		"longtitude": 101.67868,
		"waze_link": "https://www.waze.com/en/live-map/directions/my/federal-territory-of-kuala-lumpur/kuala-lumpur/subway-@-menara-uoa-bangsar?place=ChIJPWFRH5RJzDERvHvlO1uTQpY"
	},
	{
		"id": 2,
		"name": "Subway Jln Pinang",
		"address": "G9, Wisma UOA II, 19, Jalan Pinang, Kuala Lumpur, 50450",
		"operating_hours": "Monday - Saturday, 8:00 AM – 9:00PMSunday, 11:30 AM – 6:30PM | Monday - Saturday, 8:00 AM – 9:00PM | Sunday, 11:30 AM – 6:30PM",
		"latitude": 3.152705,
		"longtitude": 101.712036,
		"waze_link": "https://www.waze.com/en/live-map/directions/my/wilayah-persekutuan-kuala-lumpur/kuala-lumpur/subway-@-jalan-pinang-kl?place=ChIJIzvym9Q3zDER9MZj809Opn0"
	},
	{
		"id": 3,
		"name": "Subway UOA Damansara",
		"address": "Unit 50-G-5, Ground Floor, Wisma UOA Damansara, No. 50, Jalan Dungun, Kuala Lumpur, 50490",
		"operating_hours": "Monday - Saturday, 8:00 AM – 8:30PMSunday, Closed | Monday - Saturday, 8:00 AM – 8:30PM | Sunday, Closed",
		"latitude": 3.151729,
		"longtitude": 101.666008,
		"waze_link": "https://www.waze.com/en/live-map/directions/my/wilayah-persekutuan-kuala-lumpur/kuala-lumpur/subway-@-wisma-uoa-damansara?place=ChIJa5Vpq1RIzDER8-Wwe3eFNUI"
	},
	{
		"id": 4,
		"name": "Subway Mont Kiara",
		"address": "E-01-16 ,Block E, Plaza Mont Kiara, 2 Jalan Kiara, Mont Kiara, Kuala Lumpur, 50480",
		"operating_hours": "Monday - Sunday, 10:00 AM - 10:00 PM | Monday - Sunday, 10:00 AM - 10:00 PM",
		"latitude": 3.165686,
		"longtitude": 101.651955,
		"waze_link": "https://www.waze.com/en/live-map/directions/my/wilayah-persekutuan-kuala-lumpur/kuala-lumpur/subway-@-plaza-montkiara?place=ChIJ62Fw6vFIzDEReI7qDH2RtxQ"
	},
	{
		"id": 5,
		"name": "Subway Avenue K",
		"address": "Lot UC-8 & 9, Upper Concourse Level, Avenue K, No. 156, Jalan Ampang, Kuala Lumpur, 50450",
		"operating_hours": "Monday - Sunday, 8:00 AM - 10:00 PM | Monday - Sunday, 8:00 AM - 10:00 PM",
		"latitude": 3.159477,
		"longtitude": 101.713516,
		"waze_link": "https://www.waze.com/en/live-map/directions/subway-avenue-k-lot-uc-8-and-9,-upper-concourse-level,-avenue-k-kuala-lumpur?place=w.66650144.666566972.27413004"
	},
	{
		"id": 6,
		"name": "Subway Berjaya Times Square",
		"address": "LG-08A, Berjaya Times Square, No. 1, Jalan Imbi, Kuala Lumpur, 55100",
		"operating_hours": "Monday - Sunday, 10:00 AM - 10:00 PM | Monday - Sunday, 10:00 AM - 10:00 PM",
		"latitude": 3.142198,
		"longtitude": 101.710548,
		"waze_link": "https://www.waze.com/en/live-map/directions/subway-berjaya-times-square-lot-03-103,-3rd-floor,-berjaya-times-square-kuala-lumpur?place=w.66650143.666566970.27413449"
	},
	{
		"id": 7,
		"name": "Subway Capsquare",
		"address": "Ground Floor, Unit 01-02, Cap Square Tower, 10 Jalan Munshi Abdullah, Kuala Lumpur, 50100",
		"operating_hours": "Monday - Saturday, 8:00 AM – 9:00PMSunday, Closed | Monday - Saturday, 8:00 AM – 9:00PM | Sunday, Closed",
		"latitude": 3.154416,
		"longtitude": 101.698822,
		"waze_link": "https://www.waze.com/en/live-map/directions/my/wilayah-persekutuan-kuala-lumpur/kuala-lumpur/subway-@-capsquare?place=ChIJy-MVCLdJzDER31pWsrn_WZE"
	},
	{
		"id": 8,
		"name": "Subway University Malaya",
		"address": "Faculty of Dentistry, Level 1, Block B, University of Malaya, Kuala Lumpur, 50603",
		"operating_hours": "Monday - Friday, 8:00 AM – 6:30PMSaturday, Sunday & Public Holiday, 8:00 AM – 3:00PM | Monday - Friday, 8:00 AM – 6:30PM | Saturday, Sunday & Public Holiday, 8:00 AM – 3:00PM",
		"latitude": 3.121723,
		"longtitude": 101.653687,
		"waze_link": "https://www.waze.com/en/live-map/directions/subway-university-of-malaya-university-of-malaya-faculty-of-dentistry-petaling-jaya?place=w.66650143.666173751.27402188"
	},
	{
		"id": 9,
		"name": "Subway Wangsa Walk",
		"address": "Wangsa Ave, Bandar Wangsa Maju, #9 Jalan Perdana 1, G-52, Wangsa Walk Mall, Kuala Lumpur, 53300",
		"operating_hours": "Monday - Sunday, 9:30 AM - 9:30 PM | Monday - Sunday, 9:30 AM - 9:30 PM",
		"latitude": 3.198582,
		"longtitude": 101.742203,
		"waze_link": "https://www.waze.com/en/live-map/directions/subway-wangsa-walk-mall-g-52,-wangsa-walk-mall-kuala-lumpur?place=w.66650144.666763584.27401138"
	},
	{
		"id": 10,
		"name": "Subway TTDI",
		"address": "Lvl1, Petronas Svs Station TTDI,Lot29395 & 29396, Pinggir Zaaba, Taman Tun Dr Ismail, Kuala Lumpur, 60000",
		"operating_hours": "Monday - Sunday, 8:30 AM - 9:00 PM | Monday - Sunday, 8:30 AM - 9:00 PM",
		"latitude": 3.141958,
		"longtitude": 101.625214,
		"waze_link": "https://www.waze.com/en/live-map/directions/my/wilayah-persekutuan-kuala-lumpur/kuala-lumpur/subway-@-pinggir-zaaba-taman-tun?place=ChIJuRYqITBJzDER76oB2espXlU"
	},
	{
		"id": 11,
		"name": "Subway Menara Aras Jaya",
		"address": "LG Floor, Menara Bumiputra Commerce, No 11, Jalan Raja Laut, 50350 Kuala Lumpur",
		"operating_hours": "Monday - Friday, 8:00 AM – 9:00PMSaturday & Sunday, 10:00 AM – 7:00PM | Monday - Friday, 8:00 AM – 9:00PM | Saturday & Sunday, 10:00 AM – 7:00PM",
		"latitude": 3.155606,
		"longtitude": 101.695686,
		"waze_link": "https://www.waze.com/en/live-map/directions/subway-cimb-cimb-11-jalan-raja-laut,-lower-ground-floor-kuala-lumpur?place=w.66650144.666501436.27395039"
	},
	{
		"id": 12,
		"name": "Subway Tesco Kepong",
		"address": "Tesco Kepong Village Mall, Lot No. 14, 1st Floor, No. 3 Jalan 7A/62A Bandar Manjalara, Kuala Lumpur, 52200",
		"operating_hours": "Monday - Sunday, 10:15 AM - 9:30 PM | Monday - Sunday, 10:15 AM - 9:30 PM",
		"latitude": 3.194423,
		"longtitude": 101.633698,
		"waze_link": "https://www.waze.com/en/live-map/directions/subway-lotuss-kepong-village-lot-no.-14,-1st-floor,-lotuss-kepong-village-mall-kuala-lumpur?place=w.66584608.666042687.27399057"
	},
	{
		"id": 13,
		"name": "Subway Jalan Ipoh",
		"address": "No. 447, Jalan Ipoh, Batu 3, Taman Million, 51200 Kuala Lumpur",
		"operating_hours": "Monday - Sunday, 8:00 AM - 10:00 PM | Monday - Sunday, 8:00 AM - 10:00 PM",
		"latitude": 3.178158,
		"longtitude": 101.68512,
		"waze_link": "https://www.waze.com/en/live-map/directions/subway-rivercity-village-468-1(1),-ground-floor,-block-f-rivercity-village-kuala-lumpur?place=w.66650144.666370366.16193787"
	},
	{
		"id": 14,
		"name": "Subway Southgate",
		"address": "Pusat Komersial Southgate, No. 2, Jalan Dua, Unit E-1-6, Off Jalan Chan Sow Lin, Lvl 1, Kuala Lumpur, 55200",
		"operating_hours": "Monday - Sunday, 8:00 AM - 9:00 PM | Monday - Sunday, 8:00 AM - 9:00 PM",
		"latitude": 3.124517,
		"longtitude": 101.710678,
		"waze_link": "https://www.waze.com/en/live-map/directions/my/wilayah-persekutuan-kuala-lumpur/kuala-lumpur/subway-@-southgate-commercial-center?place=ChIJd4K2SBw2zDERvbRfvxkCiEw"
	},
	{
		"id": 15,
		"name": "Subway Brem Mall",
		"address": "G-06, Brem Mall, Jalan Kepong, Kepong, Kuala Lumpur, 52000",
		"operating_hours": "Monday - Sunday, 8:00 AM - 10:00 PM | Monday - Sunday, 8:00 AM - 10:00 PM",
		"latitude": 3.204461,
		"longtitude": 101.667603,
		"waze_link": "https://www.waze.com/en/live-map/directions/subway-brem-mall-g-06,-brem-mall,-jalan-kepong,-kepong-kuala-lumpur?place=w.66650144.666304832.27401872"
	},
	{
		"id": 16,
		"name": "Subway Festival City",
		"address": "Setapak Central Mall, Lot S-23, No. 67 Jalan Taman Ibu Kota, Taman Danau Kota, Setapak, Kuala Lumpur, 53200",
		"operating_hours": "Monday - Sunday, 10:00 AM - 10:00 PM | Monday - Sunday, 10:00 AM - 10:00 PM",
		"latitude": 3.204575,
		"longtitude": 101.720528,
		"waze_link": "https://www.waze.com/en/live-map/directions/my/federal-territory-of-kuala-lumpur/kuala-lumpur/subway-@-setapak-central-mall?place=ChIJ6fjTnRE4zDEReW77Yg4uqrY"
	},
	{
		"id": 17,
		"name": "Subway Aeon Big Wangsamaju",
		"address": "Aeon Big Wangsa Maju, F1-09, First Floor, Jalan 8/27A, Section 5, Wangsa Maju, 53300 Kuala Lumpur.",
		"operating_hours": "Monday - Sunday, 10:00 AM - 10:00 PM | Monday - Sunday, 10:00 AM - 10:00 PM",
		"latitude": 3.196496,
		"longtitude": 101.743179,
		"waze_link": "https://www.waze.com/en/live-map/directions/subway-aeon-big-wangsa-maju-f1-09,-first-floor,-aeon-big-wangsa-maju,-wangsa-maju-kuala-lumpur?place=w.66650144.666763584.27401144"
	},
	{
		"id": 18,
		"name": "Subway Endah Parade",
		"address": "Endah Parade Shopping Complex, Lot G-013A, Ground Floor, Jalan 1/149E, Kuala Lumpur, 57000",
		"operating_hours": "Monday - Sunday, 8:00 AM - 10:00 PM | Monday - Sunday, 8:00 AM - 10:00 PM",
		"latitude": 3.063303,
		"longtitude": 101.695198,
		"waze_link": "https://www.waze.com/en/live-map/directions/subway-endah-parade-endah-parade-shopping-complex,-kuala-lumpur?place=w.66650143.666501426.27401582"
	},
	{
		"id": 19,
		"name": "Subway TBS",
		"address": "Unit L4-29, 4th Floor, Terminal Bersepadu Selatan, Bandar Tasik Selatan, Kuala Lumpur, 57100",
		"operating_hours": "Monday - Sunday, 10:00 AM – 8:00PMFriday, 9:00 AM – 9:00PM | Monday - Sunday, 10:00 AM – 8:00PM | Friday, 9:00 AM – 9:00PM",
		"latitude": 3.078001,
		"longtitude": 101.710922,
		"waze_link": "https://www.waze.com/en/live-map/directions/my/federal-territory-of-kuala-lumpur/kuala-lumpur/subway-@-tbs?place=ChIJAVz8DF81zDERXWs-EKFOIF8"
	},
	{
		"id": 20,
		"name": "Subway KWC (Kenanga)",
		"address": "KWC Fashion Mall, No.2, Jalan Gelugor, Lot G-08, Kuala Lumpur, 55200",
		"operating_hours": "Monday - Sunday, 10:00 AM - 8:00 PM | Monday - Sunday, 10:00 AM - 8:00 PM",
		"latitude": 3.136102,
		"longtitude": 101.708427,
		"waze_link": "https://www.waze.com/en/live-map/directions/subway-kwc-fashion-mall-lot-g-08-kwc-fashion-mall-kuala-lumpur?place=w.66650143.666566970.27400904"
	},
	{
		"id": 21,
		"name": "Subway Selayang 18",
		"address": "Lot 3.06, 3rd Floor vendor letter SH-15-G,Grd Floor,Selayang, Kuala Lumpur, 68000 , Batu Caves, 68100",
		"operating_hours": "Monday - Sunday, 8:00 AM - 9:00 PM | Monday - Sunday, 8:00 AM - 9:00 PM",
		"latitude": 3.255174,
		"longtitude": 101.654411,
		"waze_link": "https://www.waze.com/en/live-map/directions/subway-selayang-18-persiaran-3-batu-caves?place=w.66650145.666173766.21949236"
	},
	{
		"id": 22,
		"name": "Subway Sime Darby Parkcity",
		"address": "Sime Darby Parkcity, CP Retail 2, No. 2 Jalan Intisari, Perdana Desa Parkcity, Kuala Lumpur, 52200",
		"operating_hours": "Monday - Sunday, 8:00 AM - 9:30 PM | Monday - Sunday, 8:00 AM - 9:30 PM",
		"latitude": 3.189334,
		"longtitude": 101.638542,
		"waze_link": "https://www.waze.com/en/live-map/directions/subway-desa-park-city-sime-darby-parkcity,-cp-retail-2-kuala-lumpur?place=w.66584608.666108223.14350474"
	},
	{
		"id": 23,
		"name": "Subway TM",
		"address": "Lower Ground 1 (LG1), Menara TM, Jalan Pantai Baharu, 50672 Kuala Lumpur",
		"operating_hours": "Monday, 10:00 AM – 8:00PMTuesday - Thursday, 8:00 AM – 8:00PMFriday, 8:20 AM – 8:00PMSaturday, 9:00 AM – 9:00PMSunday, Closed | Monday, 10:00 AM – 8:00PM | Tuesday - Thursday, 8:00 AM – 8:00PM | Friday, 8:20 AM – 8:00PM | Saturday, 9:00 AM – 9:00PM | Sund",
		"latitude": 3.116129,
		"longtitude": 101.665863,
		"waze_link": "https://www.waze.com/en/live-map/directions/my/federal-territory-of-kuala-lumpur/kuala-lumpur/subway-@-menara-tm?place=ChIJ97qHTY1JzDEREeRr6wtfSts"
	},
	{
		"id": 24,
		"name": "Subway Sri Gombak",
		"address": "No. G100, Jalan Prima SG3/2, Taman Prima, Sri Gombak, Kuala Lumpur, 68100",
		"operating_hours": "Monday - Sunday, 8:00 AM - 10:30 PM | Monday - Sunday, 8:00 AM - 10:30 PM",
		"latitude": 3.237666,
		"longtitude": 101.70034,
		"waze_link": "https://www.waze.com/en/live-map/directions/my/selangor/batu-caves/subway?place=ChIJi5BmZXtHzDER519jKGFtoFk"
	},
	{
		"id": 25,
		"name": "Subway Trillium, Lake Fields",
		"address": "No.66, Jalan Tasik Utama 7, Medan Niaga Tasik Damai, (Trillium) Lake Field, Sg Besi, Kuala Lumpur, 57000",
		"operating_hours": "Monday - Sunday, 8:30 AM - 10:00 PM | Monday - Sunday, 8:30 AM - 10:00 PM",
		"latitude": 3.05989,
		"longtitude": 101.710434,
		"waze_link": "https://waze.com/ul?ll=3.059890,101.710432"
	},
	{
		"id": 26,
		"name": "Subway Ikon Connaught",
		"address": "Ikon Connaught, G-02A & Alfresco GA-02A, Ground Floor, Jalan Cerdas, Taman Connaught, Kuala Lumpur, 56100",
		"operating_hours": "Monday - Sunday, 10:00 AM - 8:00 PM | Monday - Sunday, 10:00 AM - 8:00 PM",
		"latitude": 3.081465,
		"longtitude": 101.731422,
		"waze_link": "https://www.waze.com/en/live-map/directions/subway-ikon-connaught-lot-g-02a-ikon-connaught-kuala-lumpur?place=w.66650143.666698036.27398136"
	},
	{
		"id": 27,
		"name": "Subway Ativo Plaza",
		"address": "Ativo Plaza, #1 Jalan PJU 9/1, Damansara Ave, B-G-2, Block B, Bandar Sri Damansara, Kuala Lumpur, 52200",
		"operating_hours": "Monday - Saturday, 8:30 AM – 10:00PMSunday, 8:30 AM – 9:30PM | Monday - Saturday, 8:30 AM – 10:00PM | Sunday, 8:30 AM – 9:30PM",
		"latitude": 3.196263,
		"longtitude": 101.616272,
		"waze_link": "https://www.waze.com/en/live-map/directions/subway-ativo-plaza-jalan-pju-91-kuala-lumpur?place=w.66584608.665977152.5632979"
	},
	{
		"id": 28,
		"name": "Subway OUG",
		"address": "A1-07 Jalan 1/52, Taman OUG Parklane Off Jalan Klang Lama 58200 Kuala Lumpur",
		"operating_hours": "Monday - Sunday, 9:00 AM - 10:00 PM | Monday - Sunday, 9:00 AM - 10:00 PM",
		"latitude": 3.074779,
		"longtitude": 101.661591,
		"waze_link": "https://www.waze.com/en/live-map/directions/my/wilayah-persekutuan-kuala-lumpur/kuala-lumpur/subway-oug-parklane?place=ChIJW9BS3nlLzDERdemjQm9QkBE"
	},
	{
		"id": 29,
		"name": "Subway Sri Petaling",
		"address": "No. 53, Jalan Radin Bagus, 57000 Sri Petaling, Kuala Lumpur",
		"operating_hours": "Monday - Sunday, 8:00 AM - 10:00 PM | Monday - Sunday, 8:00 AM - 10:00 PM",
		"latitude": 3.070392,
		"longtitude": 101.695023,
		"waze_link": "https://www.waze.com/en/live-map/directions/subway-sri-petaling-jalan-radin-bagus-53-kuala-lumpur?place=w.66650143.666435891.12280737"
	},
	{
		"id": 30,
		"name": "Subway Aeon Alpha Angle",
		"address": "AEON Alpha Angle Shopping Ctr, Lot F37A, Jalan R1, Seksyen 1, Bandar Baru Wangsa Maju, Kuala Lumpur, 53300",
		"operating_hours": "Monday - Sunday, 10:00 AM - 10:00 PM | Monday - Sunday, 10:00 AM - 10:00 PM",
		"latitude": 3.201844,
		"longtitude": 101.731842,
		"waze_link": "https://www.waze.com/en/live-map/directions/my/federal-territory-of-kuala-lumpur/kuala-lumpur/subway-@-aeon-alpha-angle?place=ChIJKfuHkjw4zDERcBLnlBYSXNw"
	},
	{
		"id": 31,
		"name": "Subway My Town",
		"address": "Lot B1-07 & B1-08, Level Basement 1, MyTOWN Shopping Centre, Jalan Cochrane, Seksyen 90, Kuala Lumpur, 55100",
		"operating_hours": "Monday - Sunday, 10:00 AM - 10:00 PM | Monday - Sunday, 10:00 AM - 10:00 PM",
		"latitude": 3.134863,
		"longtitude": 101.722839,
		"waze_link": "https://www.waze.com/en/live-map/directions/subway-mytown-shopping-centre-b1-07-and-b1-08,-mytown-shopping-centre,-55100-kuala-lumpur?place=w.66650143.666632505.27397019"
	},
	{
		"id": 32,
		"name": "Subway Great Eastern Mall",
		"address": "Great Eastern Mall, Lot 4C Lower Ground Floor, No 303 Jalan Ampang, Kuala Lumpur, 50450",
		"operating_hours": "Monday - Friday, 8:30 AM – 8:30PMSaturday & Sunday, 9:30 AM – 8:30PM | Monday - Friday, 8:30 AM – 8:30PM | Saturday & Sunday, 9:30 AM – 8:30PM",
		"latitude": 3.160073,
		"longtitude": 101.7369,
		"waze_link": "https://www.waze.com/en/live-map/directions/subway-great-eastern-mall-great-eastern-mall,-lot-4c-lower-ground-floor-kuala-lumpur?place=w.66650144.666763580.27398397"
	},
	{
		"id": 33,
		"name": "Subway NU Sentral",
		"address": "L4.13, Level Four, NU Sentral, No. 201 Jalan Tun Sambanthan, Kuala Lumpur, 50470",
		"operating_hours": "Monday - Sunday, 9:00 AM - 9:00 PM | Monday - Sunday, 9:00 AM - 9:00 PM",
		"latitude": 3.133075,
		"longtitude": 101.687035,
		"waze_link": "https://www.waze.com/en/live-map/directions/subway-nu-sentral-l4.13,-level-four,-nu-sentral-kuala-lumpur?place=w.66650143.666435897.27398085"
	},
	{
		"id": 34,
		"name": "Subway Sunway Putra",
		"address": "Lot 4-60 & 4-79A, Fourth Floor, Sunway Putra Mall, No. 100, Jalan Putra, 50350 Kuala Lumpur",
		"operating_hours": "Monday - Sunday, 10:00 AM - 10:00 PM | Monday - Sunday, 10:00 AM - 10:00 PM",
		"latitude": 3.166426,
		"longtitude": 101.692421,
		"waze_link": "https://www.waze.com/en/live-map/directions/my/federal-territory-of-kuala-lumpur/kuala-lumpur/subway-@-sunway-putra-mall?place=ChIJZ9G0hjxIzDERadDFIQqD8Ck"
	},
	{
		"id": 35,
		"name": "Subway Melawati Mall",
		"address": "L3-22, Third Floor, Melawati Mall, UP2-01, Melawati Mall, 355, Jalan Bandar Melawati, Pusat Bandar Melawati, 53100 Kuala Lumpur",
		"operating_hours": "Monday - Sunday, 10:00 AM - 10:00 PM | Monday - Sunday, 10:00 AM - 10:00 PM",
		"latitude": 3.211379,
		"longtitude": 101.74868,
		"waze_link": "https://www.waze.com/en/live-map/directions/subway-melawati-mall-lot-l3-22-melawati-mall,-ampang-kuala-lumpur?place=w.66650144.666829121.27398467"
	},
	{
		"id": 36,
		"name": "Subway Bukit Jalil",
		"address": "Level 1 Axiata Arena, KL Sport City, Bukit Jalil, 57000, Kuala Lumpur",
		"operating_hours": "Monday - Sunday, 9:00 AM - 10:00 PM | Monday - Sunday, 9:00 AM - 10:00 PM",
		"latitude": 3.053815,
		"longtitude": 101.693436,
		"waze_link": "https://www.waze.com/en/live-map/directions/my/wilayah-persekutuan-kuala-lumpur/kuala-lumpur/subway-axiata-arena-bukit-jalil?place=ChIJ_1r32pdKzDERwqb1Q3n6L9o"
	},
	{
		"id": 37,
		"name": "Subway Pearl Point",
		"address": "Lot No. 1.0.69 (Ground Floor), Pearl Point Shopping Mall, Batu 5, Jalan Klang Lama, 58000 Kuala Lumpur",
		"operating_hours": "Monday - Sunday (9:00AM - 10:00PM) | Monday - Sunday (9:00AM - 10:00PM)",
		"latitude": 3.083153,
		"longtitude": 101.669441,
		"waze_link": "https://waze.com/ul?ll=3.083153,101.669445"
	},
	{
		"id": 38,
		"name": "Subway Gurney Mall (UTMKL)",
		"address": "Lot 1-03, Level 1, Residensi UTMKL, No 8 Jalan Maktab, 54000 Kuala Lumpur",
		"operating_hours": "Tuesday – Sunday, 10:00 AM – 9:30PMMonday, 8:00 AM – 9:30PM | Tuesday – Sunday, 10:00 AM – 9:30PM | Monday, 8:00 AM – 9:30PM",
		"latitude": 3.171561,
		"longtitude": 101.721802,
		"waze_link": "https://www.waze.com/en/live-map/directions/my/wilayah-persekutuan-kuala-lumpur/kuala-lumpur/subway-utmkl?place=ChIJ7_y8Q5A3zDER6JGmn1Nfmqc"
	},
	{
		"id": 39,
		"name": "Subway KLTS",
		"address": "45-G, Plaza KLTS, Block C, Jalan Gombak, 53000 Kuala Lumpur",
		"operating_hours": "Monday - Sunday, 9:00 AM - 9:30 PM | Monday - Sunday, 9:00 AM - 9:30 PM",
		"latitude": 3.204075,
		"longtitude": 101.703484,
		"waze_link": "https://www.waze.com/en/live-map/directions/my/federal-territory-of-kuala-lumpur/kuala-lumpur/subway-klts?place=ChIJKd965yNHzDERs76aJJNwaw4"
	},
	{
		"id": 40,
		"name": "Subway KL East Mall",
		"address": "LG 37  , Lower Ground Floor, KL East Mall, 823 Jalan Lingkaran Tengah 2, KL Timur, 53100 Kuala Lumpur",
		"operating_hours": "Sunday – Thursday, 10:00 AM – 8:00PMFriday & Saturday, 9:00 AM – 8:00PM | Sunday – Thursday, 10:00 AM – 8:00PM | Friday & Saturday, 9:00 AM – 8:00PM",
		"latitude": 3.224754,
		"longtitude": 101.73053,
		"waze_link": "https://www.waze.com/en/live-map/directions/my/wilayah-persekutuan-kuala-lumpur/kuala-lumpur/subway-kl-east-mall?place=ChIJ98w9Q285zDERzcGnUTqyW_U"
	},
	{
		"id": 41,
		"name": "Subway Bandar Sri Permaisuri",
		"address": "Lot R-G-07, Ground Floor Q Avenue, Kompleks Permaisuri Q, No.6,Jalan Sri Permaisuri, Bandar Sri Permaisuri, Cheras 56000 Kuala Lumpur",
		"operating_hours": "Monday - Sunday, 10:00 AM - 9:00 PM | Monday - Sunday, 10:00 AM - 9:00 PM",
		"latitude": 3.101187,
		"longtitude": 101.711708,
		"waze_link": "https://www.waze.com/en/live-map/directions/my/wilayah-persekutuan-kuala-lumpur/kuala-lumpur/subway-@-bandar-sri-permaisuri?place=ChIJOdM1NoI1zDERNMFVeFKzCJk"
	},
	{
		"id": 42,
		"name": "Subway KLCC",
		"address": "Lot F208, Second Floor, Suria KLCC, Jalan Ampang, Golden, 50088 Kuala Lumpur",
		"operating_hours": "Monday - Sunday, 10:00 AM - 10:00 PM | Monday - Sunday, 10:00 AM - 10:00 PM",
		"latitude": 3.159186,
		"longtitude": 101.712395,
		"waze_link": "https://www.waze.com/en/live-map/directions/my/wilayah-persekutuan-kuala-lumpur/kuala-lumpur/subway-@-suria-klcc?place=ChIJ4w-9zNY3zDER1BwAcFWcn74"
	},
	{
		"id": 43,
		"name": "Subway Kepong",
		"address": "91, Jalan Metro Barat Perdana 1, Taman Usahawan Kepong, 52100 Kuala Lumpur",
		"operating_hours": "Monday - Sunday, 8:00 AM - 8:30 PM | Monday - Sunday, 8:00 AM - 8:30 PM",
		"latitude": 3.214719,
		"longtitude": 101.639542,
		"waze_link": "https://www.waze.com/en/live-map/directions/my/wilayah-persekutuan-kuala-lumpur/kuala-lumpur/subway-kepong-metro-prima?place=ChIJcyKJRLdHzDERdeFs6es6yK4"
	},
	{
		"id": 44,
		"name": "Subway Kidzania KL",
		"address": "Kidzania Kuala Lumpur, Lot 11, Lower Ground Curve NX, No.18 Jalan PJU 7/5, 47810 Mutiara Damansara, Petaling Jaya Selangor",
		"operating_hours": "Mon - Sun : 10am-6pm | Mon - Sun : 10am-6pm",
		"latitude": 3.158034,
		"longtitude": 101.6138,
		"waze_link": "https://waze.com/ul?ll=3.158034,101.613800"
	},
	{
		"id": 45,
		"name": "Subway BHP Jalan Kuching",
		"address": "BHPetrol Jalan Kuching, Lot PT 4283 & Lot 6086 Jalan Kuching, 52100 Kuala Lumpur.",
		"operating_hours": "Monday - Sunday, 7:30 AM - 10:00 PM | Monday - Sunday, 7:30 AM - 10:00 PM",
		"latitude": 3.18844,
		"longtitude": 101.670158,
		"waze_link": "https://www.waze.com/en/live-map/directions/my/wilayah-persekutuan-kuala-lumpur/kuala-lumpur/subway-@-bhp-jalan-kuching?place=ChIJH9__naBJzDERIoGI17o-ttQ"
	},
	{
		"id": 46,
		"name": "Subway Pavilion Bukit Jalil",
		"address": "Lot 1.40.00, Persiaran Jalil Utama, Bukit Jalil, Kuala Lumpur",
		"operating_hours": "Monday - Sunday, 9:30 AM - 10:00 PM | Monday - Sunday, 9:30 AM - 10:00 PM",
		"latitude": 3.050264,
		"longtitude": 101.671013,
		"waze_link": "https://www.waze.com/en/live-map/directions/my/federal-territory-of-kuala-lumpur/kuala-lumpur/subway-@-pavilion-bukit-jalil?place=ChIJ5feNFj5LzDERnz6TuHwTHFo"
	},
	{
		"id": 47,
		"name": "Subway Lotus Cheras",
		"address": "Lot G27-G29, No.2, Jalan Midah 2, Taman Midah, 56000 Cheras, Kuala Lumpur",
		"operating_hours": "Monday - Sunday, 9:30 AM - 9:00 PM | Monday - Sunday, 9:30 AM - 9:00 PM",
		"latitude": 3.099541,
		"longtitude": 101.734764,
		"waze_link": "https://waze.com/ul?ll=3.099541,101.734766"
	},
	{
		"id": 48,
		"name": "Subway SPARK",
		"address": "1-01 Plaza Salak Park, No 2, Jalan 1/125E, Taman Desa Petaling, 57100 Kuala Lumpur",
		"operating_hours": "Monday - Sunday (8:00AM - 10:00PM) | Monday - Sunday (8:00AM - 10:00PM)",
		"latitude": 3.082778,
		"longtitude": 101.702469,
		"waze_link": "https://waze.com/ul?ll=3.082778,101.702471"
	},
	{
		"id": 49,
		"name": "Subway Aeon Taman Maluri",
		"address": "Lot G32,AEON Mall Taman Maluri, Jalan Jejaka, Taman Maluri Cheras 55100, Kuala Lumpur",
		"operating_hours": "Sunday - Thursday, 10:00 AM – 10:00PMFriday & Saturday, 10:00 AM – 10:30PM | Sunday - Thursday, 10:00 AM – 10:00PM | Friday & Saturday, 10:00 AM – 10:30PM",
		"latitude": 3.125925,
		"longtitude": 101.728401,
		"waze_link": "https://www.waze.com/en/live-map/directions/my/wilayah-persekutuan-kuala-lumpur/cheras/subway-aeon-taman-maluri?place=ChIJxZc1CgI3zDER0L07egWJ6A4"
	},
	{
		"id": 50,
		"name": "Subway KL Gateway",
		"address": "G1.K5, Lower Ground 1, KL Gateway Mall, 2, Jalan Kerinchi, 59200 Kuala Lumpur",
		"operating_hours": "Monday - Sunday (8:00AM - 10:00PM) | Monday - Sunday (8:00AM - 10:00PM)",
		"latitude": 3.114111,
		"longtitude": 101.663269,
		"waze_link": "https://www.waze.com/en/live-map/directions/my/wilayah-persekutuan-kuala-lumpur/kuala-lumpur/subway-kl-gateway-mall?place=ChIJ1cy2C85JzDERxEe6xZaRRyg"
	},
	{
		"id": 51,
		"name": "Subway Lotuss Selayang",
		"address": "Lot F-18 & 18 (External) No. 1081, Jalan Ipoh Mukim Batu 51200 Kuala Lumpur",
		"operating_hours": "Monday - Sunday (10:00AM - 10:00PM) | Monday - Sunday (10:00AM - 10:00PM)",
		"latitude": 3.222777,
		"longtitude": 101.670944,
		"waze_link": "https://waze.com/ul?ll=3.222777,101.670945"
	},
	{
		"id": 52,
		"name": "Subway Hartamas SC",
		"address": "Lot G-22A & G-22B . Hartamas Shopping Center, 60, Jalan Sri Hartamas 1, Taman Sri Hartamas, 50480 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur",
		"operating_hours": "Monday - Sunday (10:00AM - 10:00PM) | Monday - Sunday (10:00AM - 10:00PM)",
		"latitude": 3.163504,
		"longtitude": 101.656998,
		"waze_link": "https://waze.com/ul?ll=3.163504,101.656995"
	},
	{
		"id": 53,
		"name": "Subway Intermark Mall",
		"address": "The Intermark, Intermark Mall, 348, Jalan Tun Razak, 50400 Kuala Lumpur",
		"operating_hours": "Monday - Sunday, 10:00 AM - 10:00 PM | Monday - Sunday, 10:00 AM - 10:00 PM",
		"latitude": 3.161545,
		"longtitude": 101.719917,
		"waze_link": "https://www.waze.com/en/live-map/directions/my/wilayah-persekutuan-kuala-lumpur/kuala-lumpur/subway-the-intermark?place=ChIJ48goZMU3zDERrTBFRU1gP-Mhttps://www.waze.com/en/live-map/directions/my/wilayah-persekutuan-kuala-lumpur/kuala-lumpur/subway-the-inte"
	},
	{
		"id": 54,
		"name": "Subway ROHAS KL",
		"address": "No 9, Lot G-W-1, Ground Floor, West Wing, Rohas Pure Circle, Jalan P. Ramlee, 50450 Kuala Lumpur.",
		"operating_hours": "Monday - Sunday (8:00AM - 10:00PM) | Monday - Sunday (8:00AM - 10:00PM)",
		"latitude": 6.4065,
		"longtitude": 100.179756,
		"waze_link": "https://waze.com/ul?ll=6.406500,100.179757"
	},
	{
		"id": 55,
		"name": "Subway Setapak Central Mall",
		"address": "Kl Festival City, Lot S-23, No 67 Jalan Taman Ibu Kota, Taman Danau Kota, Setapak, Kuala Lumpur, 53200",
		"operating_hours": "Monday - Sunday (10:00AM - 10:00PM) | Monday - Sunday (10:00AM - 10:00PM)",
		"latitude": 3.205267,
		"longtitude": 101.720016,
		"waze_link": "https://waze.com/ul?ll=3.205267,101.720020"
	},
	{
		"id": 56,
		"name": "Subway Mid Valley KL",
		"address": "1st Floor, Zone 3, Kiosk FK-05, Mid Valley Megamall,  Lingkaran Syed Putra, Mid Valley City, 59200 Kuala Lumpur",
		"operating_hours": "Monday - Sunday (8:00AM - 10:00PM) | Monday - Sunday (8:00AM - 10:00PM)",
		"latitude": 3.118753,
		"longtitude": 101.67746,
		"waze_link": "https://waze.com/ul?ll=3.118753,101.677459"
	},
	{
		"id": 57,
		"name": "Subway Lotus Ampang",
		"address": "LOTUS’S AMPANG - OL1, Jalan Pandan Prima Dataran, Pandan Indah, 55100 Kuala Lumpur",
		"operating_hours": "Monday - Sunday (10:00AM - 10:00PM) | Monday - Sunday (10:00AM - 10:00PM)",
		"latitude": 3.143814,
		"longtitude": 101.741631,
		"waze_link": "https://waze.com/ul?ll=3.143814,101.741630"
	},
	{
		"id": 58,
		"name": "Subway Kiara Bay",
		"address": "\"Lot G-22, The Beat Kiara Bay Kepong Metropolitan Park,Jalan Lingkaran Tengah 52100 Kuala Lumpur.\"",
		"operating_hours": "Monday - Sunday (10:00AM - 10:00PM) | Monday - Sunday (10:00AM - 10:00PM)",
		"latitude": 3.226999,
		"longtitude": 101.650261,
		"waze_link": "https://waze.com/ul?ll=3.226999,101.650259"
	},
	{
		"id": 59,
		"name": "Subway SAMA Square",
		"address": "G-14, Kompleks Sama, No.2, Jalan 1/23C, 53200 Setapak, KL, Wilayah Persekutuan Kuala Lumpur",
		"operating_hours": "Monday - Sunday (10:00AM - 10:00PM) | Monday - Sunday (10:00AM - 10:00PM)",
		"latitude": 3.19444,
		"longtitude": 101.720413,
		"waze_link": "https://waze.com/ul?ll=3.194440,101.720410"
	}
	]

</script>
