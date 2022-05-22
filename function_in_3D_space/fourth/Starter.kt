package fourth

import javax.swing.JFrame

fun main() {
    val frame = JFrame()
    frame.defaultCloseOperation = JFrame.EXIT_ON_CLOSE
    frame.add(Controller())
    frame.setSize(400, 400)
    frame.isResizable = true
    frame.setLocationRelativeTo(null)
    frame.isVisible = true
}