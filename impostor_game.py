import tkinter as tk
from tkinter import messagebox, font
import random
import math


class ImpostorGame:
    def __init__(self, root):
        self.root = root
        self.root.title("Impostor")
        self.root.geometry("900x700")
        self.root.configure(bg="#0a0e27")
        self.root.resizable(True, True)
        self.root.minsize(700, 600)
        
        self.players = []
        self.impostor = None
        self.current_player_index = 0
        self.revealed_players = set()
        self.secret_word = None
        
        # Lista de palabras/conceptos para el juego
        self.words_list = [
            "Helado", "Casa", "Techo", "Perro", "Gato", "Auto", "Bici",
            "Pizza", "Hamburguesa", "Café", "Agua", "Teléfono", "Computador",
            "Silla", "Mesa", "Cama", "Puerta", "Ventana", "Jardín", "Playa",
            "Montaña", "Río", "Árbol", "Flor", "Sol", "Luna", "Estrella",
            "Avión", "Barco", "Tren", "Libro", "Película", "Música", "Guitarra",
            "Piano", "Pelota", "Zapato", "Camisa", "Sombrero", "Reloj", "Lentes",
            "Paraguas", "Mochila", "Lápiz", "Cuaderno", "Tele", "Radio",
            "Refri", "Estufa", "Sofá", "Espejo", "Toalla", "Jabón",
            "Cepillo", "Pasta de dientes", "Almohada", "Frazada", "Lámpara", "Vela",
            # Cosas típicas chilenas
            "Empanada", "Completo", "Mote con huesillo", "Sopaipilla", "Pisco",
            "Terremoto", "Caluga", "Alfajor", "Manjar", "Charquicán", "Pastel de choclo",
            "Cazuela", "Curanto", "Choripán", "Humita", "Pebre", "Lúcuma",
            "Chirimoya", "Copihue", "Araucaria", "Cóndor", "Pudú", "Huemul",
            "Moai", "Cueca", "Chupalla", "Poncho", "Manta", "Mate",
            "Bombo"
        ]
        
        self.setup_initial_screen()
    
    def show_custom_dialog(self, title, message, dialog_type="info"):
        """Mostrar diálogo personalizado moderno"""
        dialog = tk.Toplevel(self.root)
        dialog.title("")
        dialog.configure(bg="#0a0e27")
        dialog.resizable(False, False)
        dialog.transient(self.root)
        dialog.grab_set()
        
        # Centrar diálogo
        dialog.update_idletasks()
        x = (dialog.winfo_screenwidth() // 2) - 200
        y = (dialog.winfo_screenheight() // 2) - 150
        dialog.geometry(f"400x300+{x}+{y}")
        
        # Contenedor principal
        main_frame = tk.Frame(dialog, bg="#0a0e27")
        main_frame.pack(fill=tk.BOTH, expand=True, padx=30, pady=30)
        
        # Color según tipo
        color_map = {
            "info": "#6c5ce7",
            "warning": "#ffa502",
            "error": "#ff4757",
            "question": "#6c5ce7"
        }
        accent_color = color_map.get(dialog_type, "#6c5ce7")
        
        # Título
        title_label = tk.Label(
            main_frame,
            text=title.upper(),
            font=font.Font(family="Segoe UI", size=16, weight="bold"),
            bg="#0a0e27",
            fg=accent_color
        )
        title_label.pack(pady=(0, 25))
        
        # Mensaje
        message_label = tk.Label(
            main_frame,
            text=message,
            font=font.Font(family="Segoe UI", size=12, weight="bold"),
            bg="#0a0e27",
            fg="#ffffff",
            wraplength=340,
            justify=tk.CENTER
        )
        message_label.pack(pady=(0, 35))
        
        # Variable para respuesta
        result = [None]
        
        # Botones
        btn_frame = tk.Frame(main_frame, bg="#0a0e27")
        btn_frame.pack()
        
        if dialog_type == "question":
            # Dos botones: Sí y No
            yes_btn = self.create_animated_button(
                btn_frame,
                text="SÍ",
                command=lambda: [result.__setitem__(0, True), dialog.destroy()],
                bg=accent_color,
                hover_bg="#5b4bc7",
                size=12,
                px=35,
                py=12
            )
            yes_btn.pack(side=tk.LEFT, padx=(0, 15))
            
            no_btn = self.create_animated_button(
                btn_frame,
                text="NO",
                command=lambda: [result.__setitem__(0, False), dialog.destroy()],
                bg="#2d3436",
                hover_bg="#636e72",
                size=12,
                px=35,
                py=12
            )
            no_btn.pack(side=tk.LEFT)
        else:
            # Un botón: OK
            ok_btn = self.create_animated_button(
                btn_frame,
                text="OK",
                command=lambda: dialog.destroy(),
                bg=accent_color,
                hover_bg="#5b4bc7" if dialog_type != "error" else "#e63946",
                size=12,
                px=50,
                py=12
            )
            ok_btn.pack()
        
        dialog.wait_window()
        return result[0]
    
    def setup_initial_screen(self):
        """Pantalla inicial para ingresar nombres"""
        self.clear_screen()
        
        # Canvas responsivo
        canvas = tk.Canvas(self.root, bg="#0a0e27", highlightthickness=0)
        canvas.pack(fill=tk.BOTH, expand=True)
        
        # Contenedor principal
        main_frame = tk.Frame(canvas, bg="#0a0e27")
        canvas_window = canvas.create_window(0, 0, window=main_frame, anchor="nw")
        
        def center_content(event=None):
            canvas.update_idletasks()
            canvas_width = canvas.winfo_width()
            canvas_height = canvas.winfo_height()
            frame_width = main_frame.winfo_reqwidth()
            frame_height = main_frame.winfo_reqheight()
            x = (canvas_width - frame_width) // 2
            y = (canvas_height - frame_height) // 2
            canvas.coords(canvas_window, max(x, 0), max(y, 0))
        
        canvas.bind("<Configure>", center_content)
        
        # Contenedor interno
        inner_frame = tk.Frame(main_frame, bg="#0a0e27")
        inner_frame.pack(padx=40, pady=40)
        
        # Título
        title = tk.Label(
            inner_frame,
            text="IMPOSTOR",
            font=font.Font(family="Segoe UI", size=48, weight="bold"),
            bg="#0a0e27",
            fg="#ffffff"
        )
        title.pack(pady=(0, 5))
        
        # Subtítulo
        subtitle = tk.Label(
            inner_frame,
            text="GAME",
            font=font.Font(family="Segoe UI", size=16, weight="bold"),
            bg="#0a0e27",
            fg="#6c5ce7"
        )
        subtitle.pack(pady=(0, 5))
        
        # Línea decorativa
        line_canvas = tk.Canvas(inner_frame, height=30, bg="#0a0e27", highlightthickness=0)
        line_canvas.pack(fill=tk.X, pady=(0, 10))
        self.animate_line(line_canvas, 0)
        
        instruction = tk.Label(
            inner_frame,
            text="Ingresa los nombres de los jugadores (mínimo 3)",
            font=font.Font(family="Segoe UI", size=12, weight="bold"),
            bg="#0a0e27",
            fg="#a0a0b0"
        )
        instruction.pack(pady=(10, 25))
        
        # Lista de jugadores
        list_container = tk.Frame(inner_frame, bg="#0a0e27")
        list_container.pack(pady=15, fill=tk.BOTH)
        
        list_frame = tk.Frame(list_container, bg="#16213e")
        list_frame.pack(fill=tk.BOTH, expand=True)
        
        scrollbar = tk.Scrollbar(list_frame, bg="#16213e", troughcolor="#0a0e27", 
                                activebackground="#6c5ce7", bd=0, width=10)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y, padx=(5, 5))
        
        self.player_listbox = tk.Listbox(
            list_frame,
            font=font.Font(family="Segoe UI", size=12, weight="bold"),
            bg="#16213e",
            fg="#ffffff",
            selectbackground="#6c5ce7",
            selectforeground="#ffffff",
            yscrollcommand=scrollbar.set,
            height=6,
            bd=0,
            highlightthickness=0,
            activestyle='none'
        )
        self.player_listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(15, 5), pady=10)
        scrollbar.config(command=self.player_listbox.yview)
        
        # Restaurar jugadores existentes
        for player in self.players:
            self.player_listbox.insert(tk.END, player)
        
        # Entrada de nombre
        input_frame = tk.Frame(inner_frame, bg="#0a0e27")
        input_frame.pack(pady=25)
        
        self.name_entry = tk.Entry(
            input_frame, 
            font=font.Font(family="Segoe UI", size=13, weight="bold"), 
            width=20,
            bg="#16213e",
            fg="#ffffff",
            insertbackground="#6c5ce7",
            bd=0,
            highlightthickness=2,
            highlightbackground="#16213e",
            highlightcolor="#6c5ce7"
        )
        self.name_entry.pack(side=tk.LEFT, padx=(0, 10), ipady=10, ipadx=15)
        self.name_entry.bind('<Return>', lambda e: self.add_player_animated())
        
        add_btn = self.create_animated_button(
            input_frame,
            text="AGREGAR",
            command=self.add_player_animated,
            bg="#6c5ce7",
            hover_bg="#5b4bc7",
            size=11,
            px=18,
            py=10
        )
        add_btn.pack(side=tk.LEFT, padx=(0, 10))
        
        delete_btn = self.create_animated_button(
            input_frame,
            text="ELIMINAR",
            command=self.delete_player_animated,
            bg="#ff4757",
            hover_bg="#e63946",
            size=11,
            px=18,
            py=10
        )
        delete_btn.pack(side=tk.LEFT)
        
        # Botón comenzar
        start_btn = self.create_animated_button(
            inner_frame,
            text="COMENZAR JUEGO",
            command=self.start_game,
            bg="#6c5ce7",
            hover_bg="#5b4bc7",
            size=14,
            px=50,
            py=18
        )
        start_btn.pack(pady=(20, 0))
        
        self.name_entry.focus()
        
        # Animaciones de entrada
        self.root.after(100, lambda: self.fade_in_widget(title, 0))
        self.root.after(200, lambda: self.fade_in_widget(subtitle, 0))
        self.root.after(300, lambda: self.fade_in_widget(instruction, 0))
    
    def create_animated_button(self, parent, text, command, bg, hover_bg, size=12, px=25, py=10):
        """Crear botón con animación hover"""
        btn = tk.Button(
            parent,
            text=text,
            font=font.Font(family="Segoe UI", size=size, weight="bold"),
            command=command,
            bg=bg,
            fg="white",
            bd=0,
            padx=px,
            pady=py,
            cursor="hand2",
            activebackground=hover_bg,
            activeforeground="white"
        )
        
        def on_enter(e):
            btn['bg'] = hover_bg
        
        def on_leave(e):
            btn['bg'] = bg
        
        btn.bind("<Enter>", on_enter)
        btn.bind("<Leave>", on_leave)
        
        return btn
    
    def fade_in_widget(self, widget, step):
        """Animación de aparición"""
        if step <= 10:
            try:
                color_value = int(step * 25.5)
                widget.configure(fg=f"#{color_value:02x}{color_value:02x}{color_value:02x}")
                self.root.after(30, lambda: self.fade_in_widget(widget, step + 1))
            except:
                pass
    
    def animate_line(self, canvas, offset):
        """Animar línea decorativa"""
        try:
            canvas.delete("all")
            width = canvas.winfo_width()
            if width > 1:
                for i in range(width):
                    progress = (i + offset) % width / width
                    intensity = int(108 + math.sin(progress * math.pi * 4) * 40)
                    color = f"#{intensity:02x}5ce7"
                    canvas.create_line(i, 15, i+1, 15, fill=color, width=3)
            
            self.root.after(50, lambda: self.animate_line(canvas, offset + 5))
        except:
            pass
    
    def add_player_animated(self):
        """Agregar jugador con animación"""
        name = self.name_entry.get().strip()
        if name:
            if name not in self.players:
                self.players.append(name)
                self.player_listbox.insert(tk.END, name)
                self.name_entry.delete(0, tk.END)
                # Efecto visual
                self.player_listbox.itemconfig(tk.END, fg="#6c5ce7")
                self.root.after(300, lambda: self.player_listbox.itemconfig(tk.END, fg="#ffffff"))
            else:
                self.show_custom_dialog("Advertencia", "Este nombre ya existe en la lista", "warning")
        self.name_entry.focus()
    
    def delete_player_animated(self):
        """Eliminar jugador seleccionado con animación"""
        selection = self.player_listbox.curselection()
        if selection:
            index = selection[0]
            player_name = self.players[index]
            
            # Confirmar eliminación
            if self.show_custom_dialog("Confirmar", f"¿Eliminar a {player_name} de la lista?", "question"):
                # Efecto visual antes de eliminar
                self.player_listbox.itemconfig(index, fg="#ff4757")
                self.root.after(200, lambda: self.complete_deletion(index))
        else:
            self.show_custom_dialog("Información", "Selecciona un jugador de la lista para eliminarlo", "info")
    
    def complete_deletion(self, index):
        """Completar la eliminación del jugador"""
        try:
            self.players.pop(index)
            self.player_listbox.delete(index)
        except:
            pass
    
    def start_game(self):
        """Iniciar el juego"""
        if len(self.players) < 3:
            self.show_custom_dialog("Error", "Se necesitan al menos 3 jugadores para comenzar", "error")
            return
        
        self.impostor = random.choice(self.players)
        self.secret_word = random.choice(self.words_list)
        self.current_player_index = 0
        self.revealed_players = set()
        
        self.show_reveal_screen()
    
    def show_reveal_screen(self):
        """Pantalla para revelar rol"""
        self.clear_screen()
        
        if self.current_player_index < len(self.players):
            current_player = self.players[self.current_player_index]
            
            canvas = tk.Canvas(self.root, bg="#0a0e27", highlightthickness=0)
            canvas.pack(fill=tk.BOTH, expand=True)
            
            main_frame = tk.Frame(canvas, bg="#0a0e27")
            canvas_window = canvas.create_window(0, 0, window=main_frame, anchor="center")
            
            def center_content(event=None):
                canvas.coords(canvas_window, canvas.winfo_width()//2, canvas.winfo_height()//2)
            
            canvas.bind("<Configure>", center_content)
            
            # Turno de
            label_turno = tk.Label(
                main_frame,
                text="TURNO DE",
                font=font.Font(family="Segoe UI", size=12, weight="bold"),
                bg="#0a0e27",
                fg="#606070"
            )
            label_turno.pack(pady=(0, 8))
            
            # Nombre
            title = tk.Label(
                main_frame,
                text=current_player,
                font=font.Font(family="Segoe UI", size=38, weight="bold"),
                bg="#0a0e27",
                fg="#ffffff"
            )
            title.pack(pady=(0, 15))
            
            # Línea animada
            line_canvas = tk.Canvas(main_frame, width=200, height=3, bg="#0a0e27", highlightthickness=0)
            line_canvas.pack(pady=(0, 30))
            self.pulse_line(line_canvas, 0)
            
            instruction = tk.Label(
                main_frame,
                text="Presiona el botón para revelar tu rol",
                font=font.Font(family="Segoe UI", size=13, weight="bold"),
                bg="#0a0e27",
                fg="#a0a0b0"
            )
            instruction.pack(pady=(0, 40))
            
            # Botón revelar
            reveal_btn = self.create_animated_button(
                main_frame,
                text="REVELAR",
                command=lambda: self.reveal_role(current_player),
                bg="#6c5ce7",
                hover_bg="#5b4bc7",
                size=16,
                px=70,
                py=22
            )
            reveal_btn.pack(pady=(0, 30))
            
            # Progreso
            progress_frame = tk.Frame(main_frame, bg="#0a0e27")
            progress_frame.pack(pady=(30, 0))
            
            progress = tk.Label(
                progress_frame,
                text=f"{len(self.revealed_players)} / {len(self.players)}",
                font=font.Font(family="Segoe UI", size=14, weight="bold"),
                bg="#0a0e27",
                fg="#6c5ce7"
            )
            progress.pack()
            
            progress_label = tk.Label(
                progress_frame,
                text="REVELADOS",
                font=font.Font(family="Segoe UI", size=10, weight="bold"),
                bg="#0a0e27",
                fg="#505060"
            )
            progress_label.pack()
        else:
            self.show_final_screen()
    
    def pulse_line(self, canvas, phase):
        """Animar línea con pulso"""
        try:
            canvas.delete("all")
            width = 200
            for i in range(width):
                progress = i / width
                intensity = int(108 + math.sin((progress + phase/50) * math.pi * 2) * 30)
                color = f"#{intensity:02x}5ce7"
                canvas.create_line(i, 1, i+1, 1, fill=color, width=3)
            
            self.root.after(50, lambda: self.pulse_line(canvas, phase + 1))
        except:
            pass
    
    def reveal_role(self, player_name):
        """Mostrar rol del jugador"""
        self.clear_screen()
        
        canvas = tk.Canvas(self.root, bg="#0a0e27", highlightthickness=0)
        canvas.pack(fill=tk.BOTH, expand=True)
        
        main_frame = tk.Frame(canvas, bg="#0a0e27")
        canvas_window = canvas.create_window(0, 0, window=main_frame, anchor="center")
        
        def center_content(event=None):
            canvas.coords(canvas_window, canvas.winfo_width()//2, canvas.winfo_height()//2)
        
        canvas.bind("<Configure>", center_content)
        
        # Nombre del jugador
        name_label = tk.Label(
            main_frame,
            text=player_name,
            font=font.Font(family="Segoe UI", size=16, weight="bold"),
            bg="#0a0e27",
            fg="#606070"
        )
        name_label.pack(pady=(0, 35))
        
        if player_name == self.impostor:
            # Tarjeta impostor
            card_shadow = tk.Frame(main_frame, bg="#050818")
            card_shadow.pack()
            
            card = tk.Frame(card_shadow, bg="#1a1a2e")
            card.pack(padx=5, pady=5)
            
            # Borde animado
            top_border = tk.Canvas(card, height=5, bg="#1a1a2e", highlightthickness=0)
            top_border.pack(fill=tk.X)
            self.animate_gradient_border(top_border, "#ff4757", 0)
            
            card_content = tk.Frame(card, bg="#1a1a2e")
            card_content.pack(padx=60, pady=40)
            
            role_label = tk.Label(
                card_content,
                text="IMPOSTOR",
                font=font.Font(family="Segoe UI", size=44, weight="bold"),
                bg="#1a1a2e",
                fg="#ff4757"
            )
            role_label.pack(pady=(15, 20))
            
            line_canvas = tk.Canvas(card_content, width=180, height=3, bg="#1a1a2e", highlightthickness=0)
            line_canvas.pack(pady=(0, 25))
            self.pulse_line_color(line_canvas, "#ff4757", 0, 180)
            
            instruction = tk.Label(
                card_content,
                text="Trata de que no te descubran\nNo tienes palabra secreta",
                font=font.Font(family="Segoe UI", size=12, weight="bold"),
                bg="#1a1a2e",
                fg="#a0a0b0",
                justify=tk.CENTER
            )
            instruction.pack()
        else:
            # Tarjeta jugador normal
            card_shadow = tk.Frame(main_frame, bg="#050818")
            card_shadow.pack()
            
            card = tk.Frame(card_shadow, bg="#1a1a2e")
            card.pack(padx=5, pady=5)
            
            # Borde animado
            top_border = tk.Canvas(card, height=5, bg="#1a1a2e", highlightthickness=0)
            top_border.pack(fill=tk.X)
            self.animate_gradient_border(top_border, "#5ce7a4", 0)
            
            card_content = tk.Frame(card, bg="#1a1a2e")
            card_content.pack(padx=60, pady=40)
            
            role_label = tk.Label(
                card_content,
                text="JUGADOR",
                font=font.Font(family="Segoe UI", size=28, weight="bold"),
                bg="#1a1a2e",
                fg="#5ce7a4"
            )
            role_label.pack(pady=(15, 8))
            
            word_label = tk.Label(
                card_content,
                text="TU PALABRA",
                font=font.Font(family="Segoe UI", size=10, weight="bold"),
                bg="#1a1a2e",
                fg="#707080"
            )
            word_label.pack(pady=(0, 12))
            
            secret_word_label = tk.Label(
                card_content,
                text=self.secret_word.upper(),
                font=font.Font(family="Segoe UI", size=38, weight="bold"),
                bg="#1a1a2e",
                fg="#ffffff"
            )
            secret_word_label.pack(pady=(0, 18))
            
            line_canvas = tk.Canvas(card_content, width=220, height=3, bg="#1a1a2e", highlightthickness=0)
            line_canvas.pack(pady=(0, 18))
            self.pulse_line_color(line_canvas, "#5ce7a4", 0, 220)
            
            instruction = tk.Label(
                card_content,
                text="Descubre quién es el impostor\nÉl no conoce esta palabra",
                font=font.Font(family="Segoe UI", size=11, weight="bold"),
                bg="#1a1a2e",
                fg="#a0a0b0",
                justify=tk.CENTER
            )
            instruction.pack()
        
        warning = tk.Label(
            main_frame,
            text="No muestres tu rol a los demás",
            font=font.Font(family="Segoe UI", size=11, weight="bold"),
            bg="#0a0e27",
            fg="#606070"
        )
        warning.pack(pady=(35, 25))
        
        next_btn = self.create_animated_button(
            main_frame,
            text="SIGUIENTE",
            command=self.next_player,
            bg="#6c5ce7",
            hover_bg="#5b4bc7",
            size=13,
            px=50,
            py=14
        )
        next_btn.pack()
    
    def animate_gradient_border(self, canvas, base_color, phase):
        """Animar borde con gradiente"""
        try:
            canvas.delete("all")
            width = canvas.winfo_width()
            if width > 1:
                for i in range(width):
                    progress = (i + phase) % width / width
                    if base_color == "#ff4757":
                        r = int(255 - math.sin(progress * math.pi * 2) * 30)
                        canvas.create_line(i, 2, i+1, 2, fill=f"#{r:02x}4757", width=5)
                    else:
                        g = int(231 - math.sin(progress * math.pi * 2) * 30)
                        canvas.create_line(i, 2, i+1, 2, fill=f"#5c{g:02x}a4", width=5)
            
            self.root.after(50, lambda: self.animate_gradient_border(canvas, base_color, phase + 3))
        except:
            pass
    
    def pulse_line_color(self, canvas, color, phase, width_val):
        """Animar línea con color"""
        try:
            canvas.delete("all")
            for i in range(int(width_val)):
                canvas.create_line(i, 1, i+1, 1, fill=color, width=3)
            
            self.root.after(50, lambda: self.pulse_line_color(canvas, color, phase + 1, width_val))
        except:
            pass
    
    def next_player(self):
        """Pasar al siguiente jugador"""
        self.revealed_players.add(self.current_player_index)
        self.current_player_index += 1
        self.show_reveal_screen()
    
    def show_final_screen(self):
        """Pantalla final"""
        self.clear_screen()
        
        canvas = tk.Canvas(self.root, bg="#0a0e27", highlightthickness=0)
        canvas.pack(fill=tk.BOTH, expand=True)
        
        main_frame = tk.Frame(canvas, bg="#0a0e27")
        canvas_window = canvas.create_window(0, 0, window=main_frame, anchor="center")
        
        def center_content(event=None):
            canvas.coords(canvas_window, canvas.winfo_width()//2, canvas.winfo_height()//2)
        
        canvas.bind("<Configure>", center_content)
        
        title = tk.Label(
            main_frame,
            text="TODOS LOS ROLES\nHAN SIDO REVELADOS",
            font=font.Font(family="Segoe UI", size=32, weight="bold"),
            bg="#0a0e27",
            fg="#ffffff",
            justify=tk.CENTER
        )
        title.pack(pady=(0, 25))
        
        line_canvas = tk.Canvas(main_frame, width=280, height=3, bg="#0a0e27", highlightthickness=0)
        line_canvas.pack(pady=(0, 35))
        self.pulse_line(line_canvas, 0)
        
        instruction = tk.Label(
            main_frame,
            text="Es hora de discutir y votar\n\nCuando estén listos para revelar al impostor\npresiona el botón de abajo",
            font=font.Font(family="Segoe UI", size=14, weight="bold"),
            bg="#0a0e27",
            fg="#a0a0b0",
            justify=tk.CENTER
        )
        instruction.pack(pady=(0, 50))
        
        reveal_impostor_btn = self.create_animated_button(
            main_frame,
            text="REVELAR IMPOSTOR",
            command=self.reveal_impostor,
            bg="#ff4757",
            hover_bg="#e63946",
            size=16,
            px=60,
            py=22
        )
        reveal_impostor_btn.pack(pady=(0, 25))
        
        new_game_btn = tk.Button(
            main_frame,
            text="Nuevo Juego",
            font=font.Font(family="Segoe UI", size=11, weight="bold"),
            command=self.reset_game,
            bg="#0a0e27",
            fg="#707080",
            bd=0,
            padx=25,
            pady=10,
            cursor="hand2",
            activebackground="#16213e",
            activeforeground="#ffffff"
        )
        new_game_btn.pack()
        
        def hover_new(e):
            new_game_btn['fg'] = "#ffffff"
        
        def leave_new(e):
            new_game_btn['fg'] = "#707080"
        
        new_game_btn.bind("<Enter>", hover_new)
        new_game_btn.bind("<Leave>", leave_new)
    
    def reveal_impostor(self):
        """Revelar impostor"""
        self.clear_screen()
        
        canvas = tk.Canvas(self.root, bg="#0a0e27", highlightthickness=0)
        canvas.pack(fill=tk.BOTH, expand=True)
        
        main_frame = tk.Frame(canvas, bg="#0a0e27")
        canvas_window = canvas.create_window(0, 0, window=main_frame, anchor="center")
        
        def center_content(event=None):
            canvas.coords(canvas_window, canvas.winfo_width()//2, canvas.winfo_height()//2)
        
        canvas.bind("<Configure>", center_content)
        
        title = tk.Label(
            main_frame,
            text="EL IMPOSTOR ERA",
            font=font.Font(family="Segoe UI", size=16, weight="bold"),
            bg="#0a0e27",
            fg="#707080"
        )
        title.pack(pady=(0, 35))
        
        card_shadow = tk.Frame(main_frame, bg="#050818")
        card_shadow.pack()
        
        card = tk.Frame(card_shadow, bg="#1a1a2e")
        card.pack(padx=6, pady=6)
        
        top_border = tk.Canvas(card, height=6, bg="#1a1a2e", highlightthickness=0)
        top_border.pack(fill=tk.X)
        self.animate_gradient_border(top_border, "#ff4757", 0)
        
        card_content = tk.Frame(card, bg="#1a1a2e")
        card_content.pack(padx=80, pady=50)
        
        impostor_label = tk.Label(
            card_content,
            text=self.impostor.upper(),
            font=font.Font(family="Segoe UI", size=52, weight="bold"),
            bg="#1a1a2e",
            fg="#ff4757"
        )
        impostor_label.pack()
        
        new_game_btn = self.create_animated_button(
            main_frame,
            text="JUGAR DE NUEVO",
            command=self.reset_game,
            bg="#6c5ce7",
            hover_bg="#5b4bc7",
            size=14,
            px=50,
            py=18
        )
        new_game_btn.pack(pady=(50, 0))
    
    def reset_game(self):
        """Reiniciar juego manteniendo la lista de jugadores"""
        # Mantener la lista de jugadores
        self.impostor = None
        self.secret_word = None
        self.current_player_index = 0
        self.revealed_players = set()
        self.setup_initial_screen()
    
    def clear_screen(self):
        """Limpiar pantalla"""
        for widget in self.root.winfo_children():
            widget.destroy()


def main():
    root = tk.Tk()
    game = ImpostorGame(root)
    root.mainloop()


if __name__ == "__main__":
    main()
