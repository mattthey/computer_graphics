package fourth

import java.awt.Color
import java.awt.Graphics
import java.awt.Graphics2D
import java.awt.geom.Point2D
import javax.swing.JPanel
import kotlin.math.cos
import kotlin.math.sin

class Controller : JPanel() {
    private val eq: EquationController = EquationController({x, y -> cos(x * y) },
        Point2D.Double(-3.0, -1.0), Point2D.Double(2.0, 3.0))

    init {
        isFocusable = true
        isDoubleBuffered = true
        setSize(400, 400)
        invalidate()
        repaint()
    }

    override fun paint(g: Graphics) {
        val g2 = g as Graphics2D
        g2.color = Color.white
        g2.fillRect(0, 0, width, height)
        eq.paint(g2, width - 1, height - 1)
    }
}