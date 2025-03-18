<template>
	<div>
		<ol-map style="width: 100%; height: 500px;">
			<ol-view
				:center="[101.6869, 3.139]"  
				:zoom="10"
				projection="EPSG:4326"
			/>
			<ol-tile-layer>
				<ol-source-osm />
			</ol-tile-layer>
		</ol-map>
	</div>
</template>

<script setup>


</script>
