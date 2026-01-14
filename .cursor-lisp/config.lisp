;; Cursor Lisp Configuration
;; Define custom keybindings and functions here
;;
;; Keybinding format: (define-key "SEQUENCE" "LISP-CODE")
;; Sequence is space-separated keys after SPC prefix
;; Example: SPC D R means press Space, then D, then R

;; Example: SPC D R restarts Docker
(define-key "D R" 
  "(execute-command \"docker-compose.restart\")")

;; Example: SPC P P opens Python terminal with selected code
(define-key "P P"
  "(let ((code (get-selection)))
     (run-terminal-command (concat \"python3 -c '\" code \"'\")))")

;; Example: SPC F F - Quick open file
(define-key "F F"
  "(execute-command \"workbench.action.quickOpen\")")

;; Example: SPC W S - Save all files
(define-key "W S"
  "(execute-command \"workbench.action.files.saveAll\")")

;; You can define custom functions
(defun restart-docker ()
  "Restart Docker containers"
  (execute-command "docker-compose.restart"))

(defun python-eval-selection ()
  "Evaluate selected Python code in terminal"
  (let ((code (get-selection)))
    (run-terminal-command (concat "python3 -c '\" code \"'"))))

(defun format-document ()
  "Format current document"
  (execute-command "editor.action.formatDocument"))

(defun run-tests ()
  "Run tests in terminal"
  (run-terminal-command "npm test"))

;; Register keybindings using functions
(define-key "D R" "(restart-docker)")
(define-key "P P" "(python-eval-selection)")
(define-key "F F" "(format-document)")
(define-key "T T" "(run-tests)")

