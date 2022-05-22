package fourth

import java.awt.Color
import java.awt.Graphics2D
import java.awt.geom.Point2D

class EquationController(var f: (Double, Double) -> Double, var first: Point2D.Double, var second: Point2D.Double) {
    var minV = Point2D.Double(Double.MAX_VALUE, Double.MAX_VALUE)
    var maxV = Point2D.Double(Double.MIN_VALUE, Double.MIN_VALUE)
    val xi = {i: Int, n: Int -> second.x + i * (first.x - second.x) / n}
    val yi = {i: Int, n: Int -> second.y + i * (first.y - second.y) / n}
    var n = 0
    var m = 0

    fun paint(g2: Graphics2D, width: Int, height: Int) {
        val l = 2
        n = 50
        m = width * l
        getBoundaries()
        drawFunc(g2, xi, yi, {fC, sC -> Coordinate(fC, sC, f(fC, sC))}, width, height)
        drawFunc(g2, yi, xi, {fC, sC -> Coordinate(sC, fC, f(sC, fC))}, width, height)
    }

    private fun drawFunc(g2: Graphics2D, first: (Int, Int) -> Double, second: (Int, Int) -> Double,
                         vertex: (Double, Double) -> Coordinate, width: Int, height: Int) {
        val top = Array(width + 1) {height}
        val bottom = Array(width + 1) { 0 }

        for (i in 0..n) {
            val fC = first(i, n)
            for (j in 0..m) {
                val sC = second(j, m)
                val v = vertex(fC, sC).getNormalizedPoint(minV, maxV, width, height)

                if (v.y > bottom[v.x]) processVertex(g2, Color.blue, v.x, v.y, bottom)
                if (v.y < top[v.x]) processVertex(g2, Color.black, v.x, v.y, top)
            }
        }
    }

    private fun processVertex(g2: Graphics2D, color: Color, xx: Int, yy:Int, array: Array<Int>) {
        g2.color = color
        g2.drawLine(xx, yy, xx, yy)
        array[xx] = yy
    }

    private fun getBoundaries() {
        for (i in 0..n) {
            val x = xi(i, n)
            for (j in 0.. m) {
                val y = yi(j, m)
                val v = Coordinate(x, y, f(x, y))
                if (v.xx > maxV.x) maxV.x = v.xx
                if (v.xx < minV.x) minV.x = v.xx
                if (v.yy > maxV.y) maxV.y = v.yy
                if (v.yy < minV.y) minV.y = v.yy
            }
        }
    }
}