// lighting.ts — All lights and the day/night update system.
// Extracted from the original index.html with no logic changes.

import * as THREE from 'three';

// Room constants (shared with room.ts, character.ts)
export const BED_X = -3.5, BED_Z = -7.1;

export interface LightRefs {
	ambient: THREE.AmbientLight;
	dirLight: THREE.DirectionalLight;
	fillLeft: THREE.PointLight;
	fillRight: THREE.PointLight;
	ceiling: THREE.PointLight;
	deskGlow: THREE.PointLight;
	lampLight: THREE.SpotLight;
	nightLightPt: THREE.SpotLight;
	windowPane: THREE.Mesh | null; // assigned after room.ts builds walls
}

export function createLights(scene: THREE.Scene): LightRefs {
	// Soft ambient
	const ambient = new THREE.AmbientLight(0xc8d0ff, 1.4);
	scene.add(ambient);

	// Main directional
	const dirLight = new THREE.DirectionalLight(0xfff8f0, 2.8);
	dirLight.position.set(5, 10, 6);
	dirLight.castShadow = true;
	dirLight.shadow.mapSize.set(1024, 1024);
	dirLight.shadow.camera.near = 0.5;
	dirLight.shadow.camera.far = 40;
	dirLight.shadow.camera.left = dirLight.shadow.camera.bottom = -10;
	dirLight.shadow.camera.right = dirLight.shadow.camera.top = 10;
	dirLight.shadow.bias = -0.001;
	scene.add(dirLight);

	// Cool left fill (simulates window bounce)
	const fillLeft = new THREE.PointLight(0x8899dd, 1.2, 12);
	fillLeft.position.set(-4, 3, -3);
	scene.add(fillLeft);

	// Warm right fill
	const fillRight = new THREE.PointLight(0xffcc88, 0.6, 10);
	fillRight.position.set(4, 2, -2);
	scene.add(fillRight);

	// Ceiling panel
	const ceiling = new THREE.PointLight(0xfff0dd, 1.8, 14);
	ceiling.position.set(0, 6, -4);
	scene.add(ceiling);

	// Desk ambient glow (monitor backlight)
	const deskGlow = new THREE.PointLight(0x8899ff, 0.9, 4);
	deskGlow.position.set(-0.3, 1.5, -6.5);
	scene.add(deskGlow);

	// Toggleable desk lamp spotlight
	const lampLight = new THREE.SpotLight(0xffeeaa, 2.5, 5, Math.PI / 5, 0.35, 1.5);
	lampLight.position.set(0.7, 2.2, -6.15);
	lampLight.target.position.set(-0.3, 0, -6.5);
	lampLight.castShadow = true;
	lampLight.shadow.mapSize.set(512, 512);
	lampLight.shadow.bias = -0.002;
	scene.add(lampLight);
	scene.add(lampLight.target);

	// Night moonlight through window → bed
	const nightLightPt = new THREE.SpotLight(0x8899cc, 0, 9, Math.PI / 8, 0.4, 1.5);
	nightLightPt.position.set(-4.7, 3.0, -5.8);
	nightLightPt.target.position.set(BED_X, 0.5, BED_Z);
	scene.add(nightLightPt);
	scene.add(nightLightPt.target);

	return { ambient, dirLight, fillLeft, fillRight, ceiling, deskGlow, lampLight, nightLightPt, windowPane: null };
}

/**
 * updateRoomLighting — drives all lights based on simulated time.
 * dayT: 0 = full night, 1 = full day.
 * Mirrors the original updateRoomLighting() exactly.
 */
export function updateRoomLighting(
	refs: LightRefs,
	dayT: number,
	lampOn: boolean,
	laptopScreenMats: THREE.MeshStandardMaterial[],
	hour: number
): { deskGlowBase: number; lampLightBase: number; nightT: number } {
	const nightT = Math.max(0, 1 - dayT * 2.5);

	// Ambient
	refs.ambient.intensity = 0.3 + dayT * 1.1;
	refs.ambient.color.setHSL(0.63 - dayT * 0.03, 0.2 + dayT * 0.1, 0.5 + dayT * 0.1);

	// Main directional (sun/moon)
	refs.dirLight.intensity = 0.4 + dayT * 2.4;
	refs.dirLight.color.setHex(dayT > 0.5 ? 0xfff8f0 : 0x8899cc);

	// Fill lights
	refs.fillLeft.intensity = dayT * 1.2;
	refs.fillRight.intensity = dayT * 0.6;

	// Ceiling panel off at night
	refs.ceiling.intensity = 0.2 + dayT * 1.6;

	// Desk glow (monitor)
	const deskGlowBase = 0.2 + dayT * 0.7;
	refs.deskGlow.intensity = deskGlowBase;

	// Lamp
	const lampLightBase = lampOn ? 1.8 + dayT * 0.7 : 0;
	refs.lampLight.intensity = lampLightBase;

	// Moonlight
	refs.nightLightPt.intensity = nightT * 1.6;
	if (refs.nightLightPt.userData.poolMat) {
		refs.nightLightPt.userData.poolMat.opacity = nightT * 0.55;
	}
	if (refs.nightLightPt.userData.bedPoolMat) {
		refs.nightLightPt.userData.bedPoolMat.opacity = nightT * 0.45;
	}

	// Window panes glow blue at night
	if (refs.windowPane) {
		const mat = refs.windowPane.material as THREE.MeshStandardMaterial;
		mat.emissiveIntensity = (1 - dayT) * 0.55;
		mat.emissive.setHex(dayT < 0.5 ? 0x8899cc : 0xffffff);
	}

	// Laptop screens off at night
	const screensOn = !(hour < 7 || hour >= 23);
	for (const m of laptopScreenMats) {
		m.emissiveIntensity = screensOn ? 1.0 : 0;
	}

	return { deskGlowBase, lampLightBase, nightT };
}
