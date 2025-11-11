import pygame
import sys
import random
import os
from personaje import Personaje, Enemigo, Explosion
from constantes import SCREEN_WIDTH, SCREEN_HEIGHT, ASSETS_PATH

def mostrar_marca_star_wars(screen, duracion, sonido_intro_path):
    # Reproducir música de introducción
    pygame.mixer.music.load(sonido_intro_path)
    pygame.mixer.music.play()

    # Texto estilo Star Wars
    texto_lines = [
        "Hace mucho tiempo en una galaxia muy, muy lejana...",
        "",
        "UFO-Developments presenta:",
        "",
        "STAR INVADERS",
        "",
        "Un juego épico de naves espaciales",
        "donde la fuerza y la estrategia",
        "definirán tu destino..."
    ]

    font = pygame.font.Font(None, 50)
    line_surfaces = [font.render(line, True, (255, 255, 0)) for line in texto_lines]

    y_start = SCREEN_HEIGHT
    clock = pygame.time.Clock()
    tiempo_inicial = pygame.time.get_ticks()

    while pygame.time.get_ticks() - tiempo_inicial < duracion:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

        tiempo_transcurrido = pygame.time.get_ticks() - tiempo_inicial
        screen.fill((0, 0, 0))

        # Calculamos el desplazamiento hacia arriba
        y = y_start - (SCREEN_HEIGHT + len(line_surfaces)*60) * (tiempo_transcurrido / duracion)

        for i, line_surface in enumerate(line_surfaces):
            screen.blit(line_surface, (SCREEN_WIDTH//2 - line_surface.get_width()//2,
                                       y + i*60))

        pygame.display.flip()
        clock.tick(60)

    pygame.mixer.music.stop()


def main():
    pygame.init()
    screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
    pygame.display.set_caption('UFO-Developments-Star Wars')

    # --- SONIDOS ---
    sonido_laser = pygame.mixer.Sound(os.path.join(ASSETS_PATH, 'sounds', 'laserdis.mp3'))
    sonido_explosion = pygame.mixer.Sound(os.path.join(ASSETS_PATH, 'sounds', 'explosion.mp3'))

    # --- SONIDO DE PRESENTACIÓN ---
    sonido_intro_path = os.path.join(ASSETS_PATH, 'sounds', 'Imperial March - Kenobi.mp3')

    # Mostrar la marquesina tipo Star Wars durante 8 segundos
    mostrar_marca_star_wars(screen, 8000, sonido_intro_path)

    # 🔊 Reproducir música de fondo del juego
    pygame.mixer.music.load(os.path.join(ASSETS_PATH, 'sounds', 'efectos.mp3'))
    pygame.mixer.music.play(-1)

    # --- ÍCONO DEL JUEGO ---
    icon = pygame.image.load(os.path.join(ASSETS_PATH, 'images', '001.jfif'))
    pygame.display.set_icon(icon)

    # --- FONDOS ---
    fondo2 = pygame.image.load(os.path.join(ASSETS_PATH, 'images', 'fondo2.png'))
    fondo2 = pygame.transform.scale(fondo2, (SCREEN_WIDTH, SCREEN_HEIGHT))

    fondo3 = pygame.image.load(os.path.join(ASSETS_PATH, 'images', 'fondo3.jpg'))
    fondo3 = pygame.transform.scale(fondo3, (SCREEN_WIDTH, SCREEN_HEIGHT))

    fondo_actual = fondo2

    personaje = Personaje(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2)
    enemigos = []
    explosiones = []
    puntos = 0
    nivel = 1

    clock = pygame.time.Clock()
    running = True

    # --- BUCLE PRINCIPAL DEL JUEGO ---
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

        keys = pygame.key.get_pressed()
        dx, dy = 0, 0
        if keys[pygame.K_LEFT]:
            dx = -5
        if keys[pygame.K_RIGHT]:
            dx = 5
        if keys[pygame.K_UP]:
            dy = -5
        if keys[pygame.K_DOWN]:
            dy = 5

        personaje.mover(dx, dy)

        if keys[pygame.K_SPACE]:
            personaje.lanzar_laser()
            sonido_laser.play()

        for enemigo in enemigos[:]:
            enemigo.mover()
            if enemigo.rect.top > SCREEN_HEIGHT:
                enemigos.remove(enemigo)

            for laser in personaje.lasers[:]:
                if enemigo.rect.colliderect(laser.rect):
                    explosiones.append(Explosion(enemigo.rect.centerx, enemigo.rect.centery))
                    enemigos.remove(enemigo)
                    personaje.lasers.remove(laser)
                    sonido_explosion.play()
                    puntos += 10
                    break

            if enemigo.rect.colliderect(personaje.shape):
                if not personaje.recibir_dano():
                    running = False

        if random.random() < 0.02:
            x = random.randint(0, SCREEN_WIDTH - 50)
            enemigos.append(Enemigo(x, 0))

        explosiones = [exp for exp in explosiones if exp.actualizar()]

        if puntos > 0 and puntos % 250 == 0:
            fondo_actual = fondo3 if fondo_actual == fondo2 else fondo2
            puntos += 10

        screen.blit(fondo_actual, (0, 0))
        personaje.dibujar(screen)
        for enemigo in enemigos:
            enemigo.dibujar(screen)
        for explosion in explosiones:
            explosion.dibujar(screen)

        font = pygame.font.Font(None, 36)
        texto_puntos = font.render(f"Puntos: {puntos}", True, (255, 255, 255))
        texto_nivel = font.render(f"Nivel: {nivel}", True, (255, 255, 255))
        screen.blit(texto_puntos, (10, 50))
        screen.blit(texto_nivel, (10, 90))

        if puntos >= 250:
            nivel += 1
            puntos = 0

        pygame.display.flip()
        clock.tick(60)

    # --- GAME OVER ---
    screen.fill((0, 0, 0))
    font_large = pygame.font.Font(None, 74)
    font_small = pygame.font.Font(None, 36)

    texto_game_over = font_large.render("GAME OVER", True, (255, 0, 0))
    texto_mensaje = font_small.render("Que la Fuerza te acompañe", True, (255, 255, 255))

    pos_x_game_over = SCREEN_WIDTH // 2 - texto_game_over.get_width() // 2
    pos_y_game_over = SCREEN_HEIGHT // 2 - texto_game_over.get_height() // 2 - 20
    pos_x_mensaje = SCREEN_WIDTH // 2 - texto_mensaje.get_width() // 2
    pos_y_mensaje = SCREEN_HEIGHT // 2 + texto_game_over.get_height() // 2 + 20

    texto_reinicio = font_small.render("Reiniciar", True, (255, 0, 0))
    boton_rect = pygame.Rect(
        SCREEN_WIDTH // 2 - texto_reinicio.get_width() // 2,
        SCREEN_HEIGHT // 2 + 100,
        texto_reinicio.get_width(),
        texto_reinicio.get_height()
    )

    screen.blit(texto_game_over, (pos_x_game_over, pos_y_game_over))
    screen.blit(texto_mensaje, (pos_x_mensaje, pos_y_mensaje))
    pygame.draw.rect(screen, (0, 0, 0), boton_rect)
    screen.blit(texto_reinicio, (
        boton_rect.x + (boton_rect.width // 2) - (texto_reinicio.get_width() // 2),
        boton_rect.y + (boton_rect.height // 2) - (texto_reinicio.get_height() // 2)
    ))
    pygame.display.flip()

    pygame.time.wait(2000)

    reiniciar = False
    while not reiniciar:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            if event.type == pygame.MOUSEBUTTONDOWN:
                if event.button == 1 and boton_rect.collidepoint(event.pos):
                    reiniciar = True
                    main()
        pygame.display.flip()
        pygame.time.Clock().tick(60)


if __name__ == '__main__':
    main()
