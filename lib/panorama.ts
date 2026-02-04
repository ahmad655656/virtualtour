import { Scene } from './scenes';
import { loadPannellum } from './pannellum-loader';

export class PanoramaViewer {
  private viewer: any;
  private currentSceneId: string = 'entrance';
  private containerId: string;
  private scenes: Scene[];

  constructor(containerId: string, scenes: Scene[]) {
    this.containerId = containerId;
    this.scenes = scenes;
    this.initializeViewer();
  }

  private async initializeViewer() {
    try {
      const pannellum = await loadPannellum();
      
      if (!pannellum || !pannellum.viewer) {
        throw new Error('Pannellum library failed to load');
      }

      const pannellumScenes: any = {};
      
      this.scenes.forEach(scene => {
        pannellumScenes[scene.id] = {
          title: scene.title,
          panorama: scene.imageUrl,
          hotSpots: this.formatHotspots(scene.hotSpots || []),
          autoLoad: true
        };
      });

      this.viewer = pannellum.viewer(this.containerId, {
        default: {
          firstScene: this.currentSceneId,
          autoLoad: true,
          autoRotate: -2,
          sceneFadeDuration: 1000,
          compass: true,
          mouseZoom: true,
          showFullscreenCtrl: true,
          showZoomCtrl: true,
          showControls: true,
        },
        scenes: pannellumScenes
      });

      // إضافة أحداث مخصصة
      this.viewer.on('scenechange', (newSceneId: string) => {
        this.currentSceneId = newSceneId;
        window.dispatchEvent(new CustomEvent('panorama-scenechange', {
          detail: { sceneId: newSceneId }
        }));
      });

      // إضافة حدث عند النقر على Hotspot
      this.viewer.on('hotspotclick', (hotspot: any) => {
        window.dispatchEvent(new CustomEvent('panorama-hotspotclick', {
          detail: hotspot
        }));
      });

    } catch (error) {
      console.error('Failed to initialize panorama viewer:', error);
      throw error;
    }
  }

  private formatHotspots(hotspots: any[]) {
    return hotspots.map(hotspot => ({
      pitch: hotspot.pitch,
      yaw: hotspot.yaw,
      type: hotspot.type === 'scene' ? 'scene' : 'info',
      text: hotspot.text,
      sceneId: hotspot.sceneId,
      URL: hotspot.url,
      cssClass: hotspot.type === 'info' ? 'info-hotspot' : 'scene-hotspot'
    }));
  }

  public async loadScene(sceneId: string): Promise<void> {
    if (!this.viewer) {
      await this.initializeViewer();
    }
    
    if (this.viewer && sceneId !== this.currentSceneId) {
      this.viewer.loadScene(sceneId);
      this.currentSceneId = sceneId;
    }
  }

  public getCurrentSceneId(): string {
    return this.currentSceneId;
  }

  public async enterFullscreen(): Promise<void> {
    if (this.viewer) {
      this.viewer.toggleFullscreen();
    }
  }

  public destroy(): void {
    if (this.viewer) {
      try {
        this.viewer.destroy();
      } catch (e) {
        console.warn('Error destroying viewer:', e);
      }
      this.viewer = null;
    }
  }

  public isLoaded(): boolean {
    return !!this.viewer;
  }
}