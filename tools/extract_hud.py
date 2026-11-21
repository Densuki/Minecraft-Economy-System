"""Recorta os ícones de HUD (coração, fome, armadura, ping, barra de XP) e de efeitos dos seus atlas.
Uso: python3 tools/extract_hud.py <pasta_dos_anexos>   (3Nnze.png = icons.png antigo · 24w18a_mob_effects_png-atlas.png = efeitos)"""
import sys, os
from PIL import Image
U = sys.argv[1] if len(sys.argv) > 1 else '/mnt/user-data/uploads'
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets')
os.makedirs(R + '/gui', exist_ok=True); os.makedirs(R + '/effects', exist_ok=True)
ic = Image.open(f'{U}/3Nnze.png').convert('RGBA')
cut = lambda n, x, y, w, h: ic.crop((x, y, x+w, y+h)).save(f'{R}/gui/{n}.png')
for n, x, y in [('heart_container',16,0),('heart_full',52,0),('heart_half',61,0),('heart_poison',88,0),('heart_poison_half',97,0),
                ('armor_empty',16,9),('armor_half',25,9),('armor_full',34,9),
                ('food_container',16,27),('food_full',52,27),('food_half',61,27),('food_hunger',88,27),('food_hunger_half',97,27)]: cut(n, x, y, 9, 9)
for i in range(5): cut(f'ping_{5-i}', 0, 16+8*i, 10, 8); cut(f'pinging_{i+1}', 0, 176+8*i, 10, 8)
cut('ping_off', 0, 56, 10, 8); cut('xp_bg', 0, 64, 182, 5); cut('xp_fg', 0, 69, 182, 5)
# efeitos: sprites 18x18 do atlas (posição x,y). Associação feita "no olho": CONFIRA as marcadas com ? no README.
at = Image.open(f'{U}/24w18a_mob_effects_png-atlas.png').convert('RGBA')
cells = {'dolphins_grace':(64,0),'haste':(82,0),'hunger':(100,0),'fire_resistance':(64,18),'health_boost':(82,18),'infested':(100,18),'blindness':(0,36),
 'conduit_power':(18,36),'darkness':(36,36),'glowing':(64,36),'hero_of_the_village':(82,36),'invisibility':(18,64),'jump_boost':(36,64),'levitation':(54,64),
 'luck':(72,64),'mining_fatigue':(90,64),'nausea':(108,64),'night_vision':(0,82),'poison':(18,82),'oozing':(36,82),'raid_omen':(54,82),'regeneration':(72,82),
 'resistance':(90,82),'saturation':(108,82),'slow_falling':(0,100),'slowness':(18,100),'speed':(36,100),'strength':(54,100),'trial_omen':(72,100),'bad_luck':(90,100),
 'water_breathing':(108,100),'weakness':(128,0),'weaving':(128,18),'wind_charged':(128,36),'wither':(128,54),'bad_omen':(31,0),'instant_damage':(100,36),'instant_health':(0,64),'unknown_shield_glow':(0,0)}
for n, (x, y) in cells.items(): at.crop((x, y, x+18, y+18)).save(f'{R}/effects/{n}.png')
print('ok')
